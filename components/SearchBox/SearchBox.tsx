import css from './SearchBox.module.css';

interface SearchBoxProps {
    onSearch: React.ChangeEventHandler<HTMLInputElement>;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
    return (
        <input
            className={css.input}
            type="text"
            placeholder="Search notes"
            onChange={onSearch}
        />
    )
}