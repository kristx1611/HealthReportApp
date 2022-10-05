import React from 'react';
import { useState } from "react";

import classes from "./App.module.css";
import { DatasetsTable } from './DatasetsTable';

import { useDataQuery } from '@dhis2/app-runtime';
import { Menu, MenuItem } from "@dhis2/ui";
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

const request = {
    request0: {
      resource: "/dataSets",
      params: {
        fields: "id,displayName,created",
        paging: "false"
      }
    }
  }

const createTableBody = id => {
    return (
        <div className={classes.right}>
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Display Name</TableCellHead>
                        <TableCellHead>ID</TableCellHead>
                        <TableCellHead>Creation Date</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <DatasetsTable id={id}></DatasetsTable>
            </Table>
        </div>
    )
}

export function Datasets(props) {
    const { loading, error, data } = useDataQuery(request);
    const [dataset, setDataset] = useState(null);

    const showDatasetDescription = dset => {
        setDataset(dset);
    }

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <span>Loading...</span>
    }

    if (data) {
        //console.log("API response:", data);

        const menuItems = data.request0.dataSets.map(dataset => {
            return (
                <MenuItem
                    key={dataset.id}
                    label={dataset.displayName}
                    onClick={() => showDatasetDescription(dataset)}
                />
            )
        });

        const tableBody = dataset != null ? createTableBody(dataset.id) : <div className={classes.right}></div>;

        return (
            <div className={classes.container}>
                <div className={classes.left}>
                    <Menu>
                        {menuItems}
                    </Menu>
                </div>
                {tableBody}
            </div>
        );
    }
}