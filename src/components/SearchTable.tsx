import { FC, useEffect, useState } from "react"
import './SearchTable.css'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from "@mui/material";
import { searchProteins } from "../clients/uniProtClient";
import { Protein } from "../models/protein";

interface Props {
    searchQuery: string,
}

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#F5F5F5',
        color: '#000000',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        fontWeight: 600,
        lineHeight: '16px',
    },
}));


export const SearchTable: FC<Props> = ({ searchQuery }) => {
    const [proteins, setProteins] = useState<Protein[]>([]);
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

    useEffect(() => {
        async function fetch() {
            const proteinsFetched = await searchProteins(searchQuery);
            setProteins(proteinsFetched);
        }
        fetch();
    }, [searchQuery])

    const rows = proteins.map((protein: Protein, index) => createData(
        (index+1),
        protein.entry,
        protein.entryNames,
        protein.genes.join(', '),
        protein.organism,
        protein.subcellularLocation.join(', '),
        protein.length
    ));
     

    return (
        <div className="searchPageContainer">
            <h3 className="searchTableHeader">{proteins.length} Search Results for {searchQuery}</h3>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell align="left">Entry</StyledTableCell>
                            <StyledTableCell align="left">Entry Names</StyledTableCell>
                            <StyledTableCell align="left">Genes</StyledTableCell>
                            <StyledTableCell align="left">Organism</StyledTableCell>
                            <StyledTableCell align="left">Subcellular Location</StyledTableCell>
                            <StyledTableCell align="left">Length</StyledTableCell>
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
                                <TableCell align="left">{row.entry}</TableCell>
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
        </div>
    )
}