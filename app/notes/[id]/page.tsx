import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import css from "./NoteDetails.module.css";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const note = await fetchNoteById(id);

    const title = `${note.title} | NoteHub`;
    const description = note.content
        ? `${note.content.slice(0, 100)}${note.content.length > 100 ? '…' : ''}`
        : `Note "${note.title}" tagged ${note.tag} in NoteHub.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://notehub.com/notes/${id}`,
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

export default async function NoteDetailsPage ({ params }: Props) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
    });

    return (
        <div className={css.app}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <NoteDetailsClient />
            </HydrationBoundary>
        </div>
    );
}
