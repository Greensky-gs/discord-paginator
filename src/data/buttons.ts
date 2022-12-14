import { ButtonBuilder, ButtonStyle } from "discord.js";
import { buttonType } from "../types/typing";

const data: Record<buttonType, ButtonBuilder> = {
    first: new ButtonBuilder({
        emoji: '⏮️',
        style: ButtonStyle.Primary
    }),
    last: new ButtonBuilder({
        emoji: '⏭️',
        style: ButtonStyle.Primary
    }),
    next: new ButtonBuilder({
        emoji: '▶️',
        style: ButtonStyle.Primary
    }),
    previous: new ButtonBuilder({
        emoji: '◀️',
        style: ButtonStyle.Primary
    }),
    choose: new ButtonBuilder({
        emoji: '🔢',
        style: ButtonStyle.Success
    }),
    close: new ButtonBuilder({
        emoji: '❌',
        style: ButtonStyle.Danger
    })
}
export default data;