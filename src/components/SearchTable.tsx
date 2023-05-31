import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import './SearchTable.css'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Protein } from "../models/protein";
import { Link, useSearchParams } from "react-router-dom";
import { createPolymersObject } from "../helpers/proteinMappingHelper";
import { IconButton } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';

export const SearchTable = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const rowVirtualizerInstanceRef = useRef(null);
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState<string|null>(null)

    useEffect(() => {
        if (searchParams.has("sort")) {
            const currentSort = decodeURI(searchParams.get("sort")!)
            const [header, direction] = currentSort.split(' ');
            setSortField(header);
            setSortDirection(direction)
        }
    }, [])

    const handleSort = useCallback((field: string) => {
        if (field != sortField) {
            setSortDirection("asc");
            setSortField(field);
            setSearchParams(searchParams => {
                searchParams.set("sort", encodeURI(`${field} asc`));
                return searchParams;
            })
        } else if (sortDirection === "asc") {
            setSortDirection("desc");
            setSearchParams(searchParams => {
                searchParams.set("sort", encodeURI(`${field} desc`));
                return searchParams;
            })
        } else {
            setSortField("");
            setSortDirection(null);
            setSearchParams(searchParams => {
                searchParams.delete("sort");
                return searchParams;
            })
        }
    }, [sortField, sortDirection]);

    const columns: MRT_ColumnDef<Protein>[] = useMemo(() =>
        [
            {
                accessorKey: 'accession',
                header: 'Entry',
                minSize: 70,
                size: 84,
                maxSize: 90,
                Cell: ({ cell }) => {
                    return (
                        <Link to={`/protein/${cell.getValue<string>()}`}>{cell.getValue<string>()}</Link>
                    )
                },
                Header: ({ column, header }) => {
                    let color: string|undefined = undefined;
                    let direction: string|undefined = undefined;
                    if (sortField === header.id) {
                        color = "#3C86F4";   
                        if (sortDirection === "asc") {
                            direction = "rotate(180deg)";
                        }
                    } 
                    return (
                        <div className="headerCell">
                            <p>{column.columnDef.header}</p>
                            <IconButton 
                                sx={{ width: "24px", height: "24px", color: color, transform: direction }}
                                onClick={() => handleSort(header.id)}
                            >
                                <FilterListIcon />
                            </IconButton>
                        </div>
                    )
                }
            },
            {
                accessorKey: 'id',
                header: 'Entry Names',
                minSize: 120,
                size: 135,
                Header: ({ column, header }) => {
                    let color: string|undefined = undefined;
                    let direction: string|undefined = undefined;
                    if (sortField === header.id) {
                        color = "#3C86F4";   
                        if (sortDirection === "asc") {
                            direction = "rotate(180deg)";
                        }
                    } 
                    return (
                        <div className="headerCell">
                            <p>{column.columnDef.header}</p>
                            <IconButton 
                                sx={{ width: "24px", height: "24px", color: color, transform: direction }}
                                onClick={() => handleSort(header.id)}
                            >
                                <FilterListIcon />
                            </IconButton>
                        </div>
                    )
                }
            },
            {
                accessorKey: 'gene',
                header: 'Genes',
                minSize: 120,
                maxSize: 140,
                Cell: ({ cell }) => {
                    return (
                        <div className="genesContainer">
                            {cell.getValue<string[]>().map((el, index) => {
                                return <span className={index === 0 ? 'firstGene' : 'otherGenes'}>{index === 0 ? el : ', ' + el}</span>
                            })}
                        </div>
                    )
                },
                Header: ({ column, header }) => {
                    let color: string|undefined = undefined;
                    let direction: string|undefined = undefined;
                    if (sortField === header.id) {
                        color = "#3C86F4";   
                        if (sortDirection === "asc") {
                            direction = "rotate(180deg)";
                        }
                    } 
                    return (
                        <div className="headerCell">
                            <p>{column.columnDef.header}</p>
                            <IconButton 
                                onClick={() => handleSort(header.id)}
                                sx={{ width: "24px", height: "24px", color: color, transform: direction }}
                            >
                                <FilterListIcon />
                            </IconButton>
                        </div>
                    )
                }
            },
            {
                accessorKey: 'organism_name',
                header: 'Organism',
                size: 135,
                Cell: ({ cell }) => {
                    return (
                        <div className="organismContainer">{cell.getValue<string>()}</div>
                    )
                },
                Header: ({ column, header }) => {
                    let color: string|undefined = undefined;
                    let direction: string|undefined = undefined;
                    if (sortField === header.id) {
                        color = "#3C86F4";   
                        if (sortDirection === "asc") {
                            direction = "rotate(180deg)";
                        }
                    } 
                    return (
                        <div className="headerCell">
                            <p>{column.columnDef.header}</p>
                            <IconButton
                                onClick={() => handleSort(header.id)}
                                sx={{ width: "24px", height: "24px", color: color, transform: direction }}
                            >
                                <FilterListIcon />
                            </IconButton>
                        </div>
                    )
                }
            },
            {
                accessorKey: 'subcellularLocation',
                header: 'Subcellular Location',
                minSize: 80,
                size: 170,
                Header: ({ column }) => {
                    return (
                        <div className="headerCell">
                            <p>{column.columnDef.header}</p>
                        </div>
                    )
                }
            },
            {
                accessorKey: 'length',
                header: 'Length (AA)',
                minSize: 80,
                size: 100,
                Header: ({ column, header }) => {
                    let color: string|undefined = undefined;
                    let direction: string|undefined = undefined;
                    if (sortField === header.id) {
                        color = "#3C86F4";   
                        if (sortDirection === "asc") {
                            direction = "rotate(180deg)";
                        }
                    } 
                    return (
                        <div className="headerCell">
                            <p>{column.columnDef.header}</p>
                            <IconButton 
                                sx={{ width: "24px", height: "24px", color: color, transform: direction }}
                                onClick={() => handleSort(header.id)}
                            >
                                <FilterListIcon />
                            </IconButton>
                        </div>
                    )
                }
            },
        ]
    , [handleSort]);

    const searchQuery = decodeURI(searchParams.get("query") ?? "") as string;

    const filters = useMemo(() =>
        searchParams.get("filters") ? JSON.parse(decodeURI(searchParams.get("filters") ?? "")) : "",
        [searchParams]);

    const { data, fetchNextPage, isError, isFetching, isLoading, refetch } =
        useInfiniteQuery({
            queryKey: ['table-data'],
            queryFn: async ({ pageParam = null }) => {
                if (pageParam) {
                    const newProteins = await createPolymersObject(pageParam, filters, sortField, sortDirection);
                    return newProteins;
                } else {
                    const newProteins = await createPolymersObject(searchQuery, filters, sortField, sortDirection);
                    return newProteins;
                }
            },
            getNextPageParam: (_lastGroup, _) => _lastGroup.nextURL,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        });

    useEffect(() => {
        refetch({

        });
    }, [searchQuery, filters, sortField, sortDirection]);

    const flatData = useMemo(
        () => data?.pages.flatMap((page) => page.proteins) ?? [],
        [data],
    );

    const totalDBRowCount = data?.pages?.[0]?.totalNumber ?? 0;
    const totalFetched = flatData.length;

    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
                if (
                    scrollHeight - scrollTop - clientHeight < 400 &&
                    !isFetching &&
                    totalFetched < totalDBRowCount
                ) {
                    fetchNextPage();
                }
            }
        },
        [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
    );

    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef?.current);
    }, [fetchMoreOnBottomReached]);

    return (
        <div className="searchPageContainer">
            {searchQuery !== '*' ? (
                <h3 className="searchTableHeader">{totalDBRowCount} Search Results for {searchQuery}</h3>
            ) : (
                <h3 className="searchTableHeader">{totalDBRowCount} Search Results</h3>
            )}
            <MaterialReactTable columns={columns}
                muiTablePaperProps={{ sx: { boxShadow: "none" } }}
                muiTableHeadRowProps={{ sx: { boxShadow: "none" } }}
                displayColumnDefOptions={{
                    'mrt-row-numbers': {
                        size: 12,
                        maxSize: 12,
                        Header: ({}) => {
                            return (
                                <div className="headerCell">
                                    <p>#</p>
                                </div>
                            )
                        }
                    }
                }}
                data={flatData}
                enablePagination={false}
                enableRowNumbers
                enableTopToolbar={false}
                enableColumnActions={false}
                enableBottomToolbar={false}
                enableRowVirtualization
                enableColumnOrdering={false}
                enableRowOrdering={false}
                enableSorting={false}
                muiTableContainerProps={{
                    ref: tableContainerRef,
                    sx: { maxHeight: '72vh', width: "100%", borderRadius: "8px" },
                    onScroll: (
                        event, //add an event listener to the table container element
                    ) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
                }}
                muiTableHeadCellProps={{
                    sx: {
                        padding: "12px 6px 12px 14px",
                        backgroundColor: "#F5F5F5",
                        margin: "0px 1px",
                    }
                }}
                muiTableBodyCellProps={{
                    sx: { padding: "14px 6px 14px 14px" }
                }}
                muiToolbarAlertBannerProps={
                    isError
                        ? {
                            color: 'error',
                            children: 'Error loading data',
                        }
                        : undefined
                }
                state={{
                    isLoading,
                    showAlertBanner: isError,
                    showProgressBars: isFetching,
                }}
                rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //get access to the virtualizer instance
                rowVirtualizerProps={{ overscan: 4 }}
            />
        </div>
    )
}




