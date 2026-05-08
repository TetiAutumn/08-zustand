// app/docs/[...slug]/page.tsx

import { fetchNotes } from "@/lib/api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Notes from "./Notes.client";

import css from "./Notes.module.css";
import { NoteTag } from "@/types/note";


type Props = {
    params: Promise<{ slug: string[] }>;
};

export default async function NotesByCategory({ params }: Props) {
    const { slug } = await params;

    const tagToQuery = slug[0] !== 'all' ? slug[0] as NoteTag : '';

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["notes", tagToQuery],
        queryFn: () => fetchNotes({ search: '', page: 1, tag: tagToQuery }),
    });

    return (
        <div className={css.app}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Notes tag={tagToQuery} />
            </HydrationBoundary>
        </div>
    );
}
