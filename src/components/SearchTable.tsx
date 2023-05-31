import { useCallback, useEffect, useMemo, useRef } from "react"
import './SearchTable.css'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Protein } from "../models/protein";
import { Link, useSearchParams } from "react-router-dom";
import { createPolymersObject } from "../helpers/proteinMappingHelper";

const columns: MRT_ColumnDef<Protein>[] = [
    {
        accessorKey: 'entry',
        header: 'Entry',
        minSize: 70,
        size: 84,
        maxSize: 90,
        Cell: ({ cell }) => {
            return (
                <Link to={`/protein/${cell.getValue<string>()}`}>{cell.getValue<string>()}</Link>
            )
        }
    },
    {
        accessorKey: 'entryNames',
        header: 'Entry Names',
        minSize: 120,
        size: 135,
    },
    {
        accessorKey: 'genes',
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
        }
    },
    {
        accessorKey: 'organism',
        header: 'Organism',
        size: 135,
        Cell: ({ cell }) => {
            return (
                <div className="organismContainer">{cell.getValue<string>()}</div>
            )
        }
    },
    {
        accessorKey: 'subcellularLocation',
        header: 'Subcellular Location',
        minSize: 80,
        size: 170,
    },
    {
        accessorKey: 'length',
        header: 'Length (AA)',
        minSize: 80,
        size: 100,
    },
];

export const SearchTable = () => {
    const [searchParams] = useSearchParams();
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const rowVirtualizerInstanceRef = useRef(null);

    const searchQuery = decodeURI(searchParams.get("query") ?? "") as string;
    const filters = useMemo(() => 
        searchParams.get("filters") ? JSON.parse(decodeURI(searchParams.get("filters") ?? "")) : "", 
    [searchParams]);

    const { data, fetchNextPage, isError, isFetching, isLoading, refetch } =
        useInfiniteQuery({
            queryKey: ['table-data'],
            queryFn: async ({ pageParam = null }) => {
                if (pageParam) {
                    const newProteins = await createPolymersObject(pageParam, filters);
                    return newProteins;
                } else {
                    const newProteins = await createPolymersObject(searchQuery, filters);
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
    }, [searchQuery, filters]);

    const flatData = useMemo(
        () => data?.pages.flatMap((page) => page.proteins) ?? [],
        [data],
    );

    const totalDBRowCount = data?.pages?.[0]?.totalNumber ?? 0;
    const totalFetched = flatData.length;

    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
                //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
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

    //a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
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




