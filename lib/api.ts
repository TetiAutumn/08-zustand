import axios from "axios";
import type { Note, NoteTag } from "../types/note";

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export interface CreateNoteOptions {
    title: string;
    content: string | null;
    tag: NoteTag
}

interface FetchNotesOptions {
    search?: string;
    page?: number;
    tag?: NoteTag | '';
}

const headers = {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
}

export const fetchNotes = async (options: FetchNotesOptions): Promise<FetchNotesResponse> => {
    try {
        const { search, page, tag } = options;
        
        const response = await axios.get<FetchNotesResponse>(
            `https://notehub-public.goit.study/api/notes?search=${search}&page=${page}${tag ? `&tag=${tag}` : ''}`,
            { headers }
        );
        return response.data;
    } catch (e) {
        console.log(e);
        throw new Error('error to fetch all notes');

    }
}

export const createNote = async ({ title, content, tag }: CreateNoteOptions): Promise<Note> => {
    try {
        const response = await axios.post<Note>(
            `https://notehub-public.goit.study/api/notes`,
            {
                title,
                content,
                tag,
            },
            { headers }
        );
        return response.data;
    } catch (e) {
        console.log(e);
        throw new Error('error to create new note');
    }
}

export const deleteNote = async (id: string): Promise<Note> => {
    try {
        const response = await axios.delete<Note>(
            `https://notehub-public.goit.study/api/notes/${id}`,
            { headers }
        );
        return response.data;
    } catch (e) {
        console.log(e);
        throw new Error('error to delete a note');
    }
}

export const fetchNoteById = async (id: string): Promise<Note> => {
    try {
        const response = await axios.get<Note>(
            `https://notehub-public.goit.study/api/notes/${id}`,
            { headers }
        );
        return response.data;
    } catch (e) {
        console.log(e);
        throw new Error('error to fetch note by id');
    }
}
