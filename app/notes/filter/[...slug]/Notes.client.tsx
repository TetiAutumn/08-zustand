"use client";
import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";

import css from "./Notes.module.css";
import { NoteTag } from "@/types/note";

export default function Notes({ tag }: { tag: NoteTag | ''}) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState<number>(1);

    const { data } = useQuery({
        queryKey: ["notes", search, page, tag],
        queryFn: () => fetchNotes({ search, page, tag }),
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    });

    const debouncedSearch = useDebouncedCallback((value: string) => {
        setPage(1);
        setSearch(value);
    }, 500);

    const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        debouncedSearch((event.target as HTMLInputElement).value);
    };

    const handlePage = (page: number) => {
        setPage(page);
    }

    return (
        <>
            <div className={css.toolbar}>
                <SearchBox onSearch={handleSearch} />
                {data && data.totalPages > 0 && (
                    <Pagination
                        page={page}
                        totalPages={data?.totalPages || 0}
                        onPageChange={handlePage}
                    />
                )}
                <Link href="/notes/action/create" className={css.button}>
                    Create note +
                </Link>
            </div>
            {data && data.notes.length > 0 &&
                <NoteList notes={data?.notes || []} />
            }
        </>
    );
}
