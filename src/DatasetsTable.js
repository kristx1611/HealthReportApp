import { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableFoot,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui'

// Data Query with dynamic ID.
const dataQuery = {
    dataSets: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: ['dataSetElements[dataElement[id, displayName,created]'],
            paging: false,
        },
    },
}

// A component that takes a dataSet ID as a prop.
export function DatasetsTable({ id }) {
    /* 
    A useDataQuery where we pass the id as a variable. Note that we also save the refetch
    which allows us to run the query again at a later point.
    */
    const { loading, error, data, refetch } = useDataQuery(dataQuery, {
        variables: {
            id: id,
        },
    })

    /* 
    You can use useEffect to check if props change (and not just state).
    We check if the ID prop has changed from the last run and then re-run the 
    dataQuery with the new id to get fresh data when a user clicks on a new ID.
    */
    useEffect(() => {
        refetch({ id: id })
    }, [id])

    if (error) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell>ERROR: {error.message}</TableCell>
                </TableRow>
            </TableBody>

        )
    }

    if (loading) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell>Loading...</TableCell>
                </TableRow>
            </TableBody>
        )
    }

    if (data) {
        //console.log("API response:", datae);

        return (
            <TableBody>
                {data.dataSets.dataSetElements.map(elements => {
                    return (
                        <TableRow key={elements.dataElement.id}>
                            <TableCell>{elements.dataElement.displayName}</TableCell>
                            <TableCell>{elements.dataElement.id}</TableCell>
                            <TableCell>{elements.dataElement.created}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        );
    }
}

