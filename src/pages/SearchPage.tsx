import { Button, IconButton } from '@mui/material'
import './SearchPage.css'
import { DisplaySettingsOutlined } from '@mui/icons-material'
import { useRef, useState } from 'react';
import { SearchTable } from '../components/SearchTable';

export const SearchPage = () => {
    const searchRef = useRef<HTMLInputElement>(null)
    const [searchState, setSearchState] = useState('');

    const handleOnSearch = () => {
        if (searchRef.current) {
            setSearchState(searchRef.current.value)
        }
    }

    return (
        <div className="searchPageLayout">
            <div className="searchPageHeader">
                <input ref={searchRef} placeholder='Enter search value' className="searchInput"></input>
                <Button onClick={handleOnSearch} sx={{
                    margin: "0px 13px 0px 13px",
                    width: "179px",
                    height: "40px",
                    background: "rgba(60, 134, 244, 0.2)",
                    borderRadius: "8px",
                    color: "#3C86F4",
                }}>Search</Button>
                <IconButton sx={{
                    display: "inline-block",
                    width: "40px",
                    height: "40px",
                    background: "rgba(60, 134, 244, 0.2)",
                    borderRadius: "8px",
                    color: "#3C86F4",
                }}>
                    <DisplaySettingsOutlined />
                </IconButton>
            </div>
            {searchState ? (
                <SearchTable searchQuery={searchState} />
            ) : (
                <div className="searchPagePlaceHolder"> No data to display<br />Please start search to display results</div>
            )}
        </div>
    )
}