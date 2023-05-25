import { FC, useEffect, useState } from "react"
import './SearchTable.css'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from "@mui/material";
import { Protein } from "../models/protein";
import { Link, useSearchParams } from "react-router-dom";
import { createPolymersObject } from "../helpers/proteinMappingHelper";

interface Props {
    startRow: number,
}

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#F5F5F5',
        color: '#000000',
    },
    [`&.${tableCellClasses.body}`]: {
        fontStyle: 'normal',
        fontSize: 12,
        fontWeight: 600,
        lineHeight: '16px',
    },
}));


export const SearchTable: FC<Props> = ({ startRow }) => {
    const [proteins, setProteins] = useState<Protein[]>([]);
    const [searchParams] = useSearchParams();

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

    useEffect(() => {
        async function fetch() {
            const proteinsFetched = await createPolymersObject(searchQuery);
            setProteins(proteinsFetched);
        }
        fetch();
    }, [searchParams])

    const rows = proteins.map((protein: Protein, index) => createData(
        (index + 1),
        protein.entry,
        protein.entryNames,
        protein.genes.join(', '),
        protein.organism,
        protein.subcellularLocation.join(', '),
        protein.length
    ));

    return (
        <div className="searchPageContainer">
            {searchQuery !== '*' ? (
                <h3 className="searchTableHeader">{startRow}-{startRow + proteins.length - 1} Search Results for {searchQuery}</h3>
            ) : (
                <h3 className="searchTableHeader">{proteins.length} Search Results</h3>
            )}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: "75vh", width: '82.5vw' }}>
                    <Table stickyHeader sx={{ width: '100%' }} aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>#</StyledTableCell>
                                <StyledTableCell align="left">Entry</StyledTableCell>
                                <StyledTableCell align="left">Entry Names</StyledTableCell>
                                <StyledTableCell align="left">Genes</StyledTableCell>
                                <StyledTableCell align="left">Organism</StyledTableCell>
                                <StyledTableCell align="left">Subcellular Location</StyledTableCell>
                                <StyledTableCell align="left">Length (AA)</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.index}
                                    </TableCell>
                                    <TableCell align="left"><Link to={`/protein/${row.entry}`}>{row.entry}</Link></TableCell>
                                    <TableCell align="left">{row.entryNames}</TableCell>
                                    <TableCell align="left">{row.genes}</TableCell>
                                    <TableCell align="center">{row.organism}</TableCell>
                                    <TableCell align="left">{row.subcellularLocation}</TableCell>
                                    <TableCell align="left">{row.length}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    )
}

//span onClick={handleOnClick} style={{ textDecoration: 'underline', cursor: 'pointer' }}