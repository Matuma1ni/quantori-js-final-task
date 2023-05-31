import { Button, IconButton } from '@mui/material'
import './SearchPage.css'
import { DisplaySettingsOutlined } from '@mui/icons-material'
import { useEffect, useRef, useState } from 'react';
import { SearchTable } from '../components/SearchTable';
import { useSearchParams } from 'react-router-dom';
import { Filters } from '../components/Filters';

export const SearchPage = () => {
    const searchRef = useRef<HTMLInputElement>(null)
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchState, setSearchState] = useState('');
    const [filtersVisible, setFiltersVisible] = useState<boolean>(false)


    useEffect(() => {
        if (searchParams.has("query")) {
            const currentQuery = decodeURI(searchParams.get("query")!)
            setSearchState(currentQuery);
            searchRef.current!.value = currentQuery;
        }
    }, [])

    const handleOnSearch = () => {
        if (searchRef.current) {
            if (searchRef.current.value.trim()) {
                setSearchState(searchRef.current.value);
                setSearchParams(searchParams => {
                    searchParams.set("query", encodeURI(searchRef.current!.value.trim().toLowerCase()));
                    return searchParams;
                })
            } else {
                setSearchState('*');
                setSearchParams(searchParams => {
                    searchParams.set("query", '*');
                    return searchParams;
                })
            }
        }
    }

    return (
        <div className="searchPageLayout">
            <div className="searchPageHeader">
                <input
                    ref={searchRef}
                    onFocus={() => setFiltersVisible(false)}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            handleOnSearch()
                        }
                    }}
                    placeholder='Enter search value' className="searchInput">
                </input>
                <Button onClick={handleOnSearch} sx={{
                    margin: "0px 13px 0px 13px",
                    width: "179px",
                    height: "40px",
                    background: "rgba(60, 134, 244, 0.2)",
                    borderRadius: "8px",
                    color: "#3C86F4",
                }}>Search</Button>
                <IconButton
                    onClick={() => setFiltersVisible(!filtersVisible)}
                    sx={{
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
            {(filtersVisible) ? <Filters onClose={() => setFiltersVisible(false)} /> : <></>}
            {searchState ? (
                <SearchTable />
            ) : (
                <div className="searchPagePlaceHolder"> No data to display<br />Please start search to display results</div>
            )}
        </div>
    )
}