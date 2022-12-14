import { CommandInteraction, User, EmbedBuilder, InteractionReplyOptions, ButtonBuilder } from "discord.js";

export type buttonType = 'next' | 'previous' | 'first' | 'last' | 'choose' | 'close';

export type paginatorOptions = {
    buttons?: {
        [K in buttonType]?: ButtonBuilder
    }
} & {
    interaction: CommandInteraction;
    user: User;
    embeds: EmbedBuilder[];
    time?: number;
    displayPages?: false | 'footer' | 'author' | 'description-bottom';
    numeriseLocale?: string;
    cancelContent?: InteractionReplyOptions;
    interactionNotAllowedContent?: InteractionReplyOptions;
    invalidPageContent: (max: number) => InteractionReplyOptions;
    modal?: {
        title?: string;
        fieldName?: string;
    }
};