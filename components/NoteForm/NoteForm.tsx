"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import css from "./NoteForm.module.css";
import { createNote, type CreateNoteOptions } from "../../lib/api";
import { useNoteStore, type NoteDraft } from "../../lib/store/noteStore";
import type { NoteTag } from "../../types/note";

export const NoteForm = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const draft = useNoteStore((state) => state.draft);
    const setDraft = useNoteStore((state) => state.setDraft);
    const clearDraft = useNoteStore((state) => state.clearDraft);

    const createNoteMutation = useMutation({
        mutationFn: (data: CreateNoteOptions) => createNote(data),
        onSuccess: async () => {
            clearDraft();
            await queryClient.invalidateQueries({ queryKey: ["notes"] });
            router.push("/notes/filter/all");
        },
    });

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target;
        setDraft({ [name]: value } as Partial<NoteDraft>);
    };

    const formAction = (formData: FormData) => {
        createNoteMutation.mutate({
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            tag: formData.get("tag") as NoteTag,
        });
    };

    return (
        <form className={css.form} action={formAction}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    className={css.input}
                    defaultValue={draft.title}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={50}
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    rows={8}
                    className={css.textarea}
                    defaultValue={draft.content}
                    onChange={handleChange}
                    maxLength={500}
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select
                    id="tag"
                    name="tag"
                    className={css.select}
                    defaultValue={draft.tag}
                    onChange={handleChange}
                    required
                >
                    <option value="Todo">Todo</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Shopping">Shopping</option>
                </select>
            </div>

            <div className={css.actions}>
                <button
                    type="button"
                    className={css.cancelButton}
                    onClick={() => router.back()}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={css.submitButton}
                    disabled={createNoteMutation.isPending}
                >
                    Create note
                </button>
            </div>
        </form>
    );
};
