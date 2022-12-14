import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder, InteractionCollector } from "discord.js";
import { paginatorOptions } from "./typing";

export class Paginator {
    public readonly options: paginatorOptions;
    private _index: number;
    private collector: InteractionCollector<ButtonInteraction<'cached'>>;

    public constructor(options: paginatorOptions);

    public stop(): void;
    private mapEmbeds(): EmbedBuilder[];
    private endMessage(): void;
    private customId(): string;
    private async start(): void;
    private updateMessage(): void;
    private pickEmbed(): EmbedBuilder;
    private get components(): ActionRowBuilder<ButtonBuilder>;

    public get index(): number;
}

export { buttonType, paginatorOptions } from './typing';