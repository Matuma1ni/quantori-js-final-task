import {  useCallback, useEffect, useMemo, useRef, useState } from "react"
import './SearchTable.css'
import {  Typography, styled, tableCellClasses } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';
import { Protein } from "../models/protein";
import { Link, useSearchParams } from "react-router-dom";
import { createPolymersObject } from "../helpers/proteinMappingHelper";

const columns: MRT_ColumnDef<Protein>[] = [
    {
        accessorKey: 'entry',
        header: 'Entry',
    },
    {
        accessorKey: 'entryNames',
        header: 'Entry Names',
    },
    {
        accessorKey: 'genes',
        header: 'Genes',
    },
    {
        accessorKey: 'organism',
        header: 'Organism',
    },
    {
        accessorKey: 'subcellularLocation',
        header: 'Subcellular Location',
    },
    {
        accessorKey: 'length',
        header: 'Length (AA)',
    },
];

const fetchSize = 25;

export const SearchTable = () => {
    const [proteins, setProteins] = useState<Protein[]>([]);
    const [totalNumber, setTotalNumber] = useState(0);
    const [nextURL, setNextURL] = useState('');
    const [searchParams] = useSearchParams();
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const rowVirtualizerInstanceRef = useRef(null);

    function createData(
        index: number,
        entry: string,
        entryNames: string,
        genes: string,
        organism: string,
        subcellularLocation: string,
        length: number,
    ) {
        return { index, entry, entryNames, genes, organism, subcellularLocation, length };
    }

    const searchQuery = searchParams.get("query") as string

    const rows = proteins.map((protein: Protein, index) => createData(
        (index + 1),
        protein.entry,
        protein.entryNames,
        protein.genes.join(', '),
        protein.organism,
        protein.subcellularLocation.join(', '),
        protein.length
    ));

    const { data, fetchNextPage, isError, isFetching, isLoading } =
        useInfiniteQuery({
            queryKey: ['table-data'],
            queryFn: async ({ pageParam = null }) => {
                if (pageParam) {
                    const newProteins = await createPolymersObject(pageParam);
                    return newProteins;
                } else {
                    const newProteins = await createPolymersObject(searchQuery);
                    return newProteins;
                }
            },
            getNextPageParam: (_lastGroup, _) => _lastGroup.nextURL,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        });

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
                console.log("fetching");
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
                data={flatData}
                enablePagination={false}
                enableRowNumbers
                enableRowVirtualization //optional, but recommended if it is likely going to be more than 100 rows
                manualFiltering
                manualSorting
                muiTableContainerProps={{
                    ref: tableContainerRef, //get access to the table container element
                    sx: { maxHeight: '600px' }, //give the table a max height
                    onScroll: (
                        event, //add an event listener to the table container element
                    ) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
                }}
                muiToolbarAlertBannerProps={
                    isError
                        ? {
                            color: 'error',
                            children: 'Error loading data',
                        }
                        : undefined
                }
                renderBottomToolbarCustomActions={() => (
                    <Typography>
                        Fetched {totalFetched} of {totalDBRowCount} total rows.
                    </Typography>
                )}
                state={{
                    isLoading,
                    showAlertBanner: isError,
                    showProgressBars: isFetching,
                }}
                rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //get access to the virtualizer instance
                rowVirtualizerProps={{ overscan: 4 }} />
        </div>
    )
}




