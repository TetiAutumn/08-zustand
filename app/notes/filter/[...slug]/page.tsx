import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import Notes from "./Notes.client";

import css from "./Notes.module.css";
import { NoteTag } from "@/types/note";


type Props = {
    params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const filter = slug[0];

    const title =
        filter === 'all'
            ? 'All notes | NoteHub'
            : `Notes tagged "${filter}" | NoteHub`;

    const description =
        filter === 'all'
            ? 'Browse every note you have created in NoteHub.'
            : `Browse the list of NoteHub notes filtered by the "${filter}" tag.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://notehub.com/notes/filter/${slug.join('/')}`,
            images: [
                {
                    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
    };
}

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
