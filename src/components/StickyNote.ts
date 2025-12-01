import { Types, createComponent } from "@iwsdk/core";

export const NoteColor = {
    Yellow: "yellow",
    Blue: "blue",
    Green: "green",
    Pink: "pink",
    Purple: "purple",
} as const;

export const StickyNote = createComponent("StickyNote", {
    content: { type: Types.String, default: "New Note" },
    color: { type: Types.Enum, enum: NoteColor, default: NoteColor.Yellow },
    createdAt: { type: Types.Float32, default: 0 },
    isPinned: { type: Types.Boolean, default: false },
});
