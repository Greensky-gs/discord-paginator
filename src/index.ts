import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ComponentType,
    InteractionCollector,
    Message,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';
import data from './data/buttons';
import { buttonType, paginatorOptions } from './types/typing';

export class Paginator {
    public readonly options: paginatorOptions;
    private _index: number = 0;
    private collector: InteractionCollector<ButtonInteraction<'cached'>>;

    constructor(options: paginatorOptions) {
        this.options = options;
        this.options.time = options?.time ?? 120000;

        this.options.cancelContent = this.options.cancelContent ?? { content: "Canceled", ephemeral: true };
        this.options.displayPages = this.options.displayPages ?? 'footer';
        this.options.numeriseLocale = this.options.numeriseLocale ?? 'en';
        this.options.interactionNotAllowedContent = this.options.interactionNotAllowedContent ?? { content: "You cannot interact with this message", ephemeral: true };
        this.options.buttons = {};
        this.options.modal = {
            title: this.options?.modal?.title ?? "Switch page",
            fieldName: this.options?.modal?.fieldName ?? "Page number"
        };
        this.options.invalidPageContent = this.options?.invalidPageContent ?? ((max) => {
            return {
                content: `Please input a valid number, between **1** and **${max}**`
            }
        });

        (['first', 'previous', 'next', 'last', 'choose', 'close'] as buttonType[]).forEach((key: buttonType) => {
            this.options.buttons[key] = this.options.buttons[key] ?? data[key];
            this.options.buttons[key].setDisabled(false).setCustomId(key);
        });

        this.start();
    }

    public stop() {
        this.collector.stop();
    }
    private mapEmbeds() {
        if (this.options.displayPages === false) return this.options.embeds;

        return this.options.embeds.map((embed, index) => {
            const page = `${(index + 1).toLocaleString(this.options.numeriseLocale)}/${this.options.embeds.length.toLocaleString(this.options.numeriseLocale)}`;

            switch (this.options.displayPages) {
                case 'author':
                    embed.setAuthor({ name: page })
                break;
                case 'description-bottom':
                    embed.setDescription(embed.data.description + `\n\n${page}`)
                break;
                case 'footer':
                    embed.setFooter({ text: page })
                break;
            }

            return embed;
        })
    }
    private endMessage() {
        this.options.interaction
            .editReply(this.options.cancelContent)
            .catch(() => {});
    }
    private customId(t: buttonType) {
        return t;
    }

    private async start() {
        this.mapEmbeds();
        const fnt = (this.options.interaction.replied || this.options.interaction.deferred) ? 'editReply' : 'reply';
        
        const reply = (await this.options.interaction[fnt]({
            components: this.components,
            embeds: [this.pickEmbed()],
            fetchReply: true
        }).catch(() => {})) as Message<true>;

        if (!reply) return;

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button
        });

        collector.on('collect', async (interaction) => {
            if (interaction.user.id !== this.options.user.id) {
                interaction
                    .reply(this.options.interactionNotAllowedContent)
                    .catch(() => {});
                return;
            }

            if (interaction.customId === this.customId('close')) {
                this.stop();
                return;
            }

            if (interaction.customId === this.customId('choose')) {
                const modal = new ModalBuilder({
                    components: [
                        new ActionRowBuilder({
                            components: [
                                new TextInputBuilder({
                                    customId: 'paginatorSelectField',
                                    placeholder: '1',
                                    style: TextInputStyle.Short,
                                    maxLength: this.options.embeds.length.toString().length,
                                    required: true,
                                    label: this.options.modal.fieldName
                                })
                            ]
                        }) as ActionRowBuilder<TextInputBuilder>
                    ],
                    customId: 'paginatorSelectModal',
                    title: this.options.modal.title
                });

                interaction.showModal(modal);
                const reply = await interaction
                    .awaitModalSubmit({
                        time: 120000
                    })
                    .catch(() => {});

                if (!reply) return;
                const pageIndex = parseInt(reply.fields.getTextInputValue('paginatorSelectField'));
                if (!pageIndex || isNaN(pageIndex) || pageIndex < 1 || pageIndex > this.options.embeds.length) {
                    reply
                        .reply(this.options.invalidPageContent(this.options.embeds.length))
                        .catch(() => {});
                    return;
                }

                reply.deferUpdate();

                this._index = pageIndex - 1;
            }

            switch (interaction.customId) {
                case this.customId('next'):
                    this._index++;
                    break;
                case this.customId('first'):
                    this._index = 0;
                    break;
                case this.customId('previous'):
                    this._index--;
                    break;
                case this.customId('last'):
                    this._index = this.options.embeds.length - 1;
                    break;
            }

            interaction.deferUpdate().catch(() => {});
            this.updateMessage();
        });

        collector.on('end', () => {
            this.endMessage();
        });

        this.collector = collector;
    }

    private updateMessage() {
        this.options.interaction.editReply({
            embeds: [this.pickEmbed()],
            components: this.components
        });
    }

    private pickEmbed() {
        return this.options.embeds[this.index];
    }

    public get index() {
        return this._index;
    }

    private get components() {
        const { first, previous, choose, close, next, last } = this.options.buttons;

        const components = [
            new ActionRowBuilder({
                components: [
                    first.setDisabled(this.index === 0),
                    previous.setDisabled(this.index < 1),
                    choose,
                    next.setDisabled(!(this.index < this.options.embeds.length - 1)),
                    last.setDisabled(this.index === this.options.embeds.length - 1)
                ]
            }) as ActionRowBuilder<ButtonBuilder>,
            new ActionRowBuilder({
                components: [
                    close
                ]
            }) as ActionRowBuilder<ButtonBuilder>
        ];

        return components;
    }
}

export { paginatorOptions, buttonType } from './types/typing';