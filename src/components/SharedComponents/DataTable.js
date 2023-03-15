import React from "react";
import MUIDataTable from "mui-datatables";

// both of these are part of the sample provided. present for illustrative purposes - actual data has to be passed in!
/*
    const data = [
        { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
        { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
        { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
        { name: "James Houston", company: "Test Corp", city: "Dallas", state: "TX" },
    ];

    const columns = [
        {
            name: "name",
            label: "Name",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "company",
            label: "Company",
            options: {
                filter: true,
                sort: false,
            }
        },
    ];
*/

export default function DataTable(props) {

    // props:
    //  data: data to display in the table
    //  columns: columns to appear in the table
    //  rowsSelected: array of rows selected - should be one (1)
    //  DefaultToolbar: Toolbar Component
    //  SelectToolbar: Toolbar Component (appears when selected)
    //  onRowSelectionChange: callback function

    return (
        <MUIDataTable
            title={<props.DefaultToolbar/>}
            data={props.data}
            columns={props.columns}
            options={{
                filterType: 'textField',
                selectableRows: 'single',
                selectableRowsOnClick: true,
                selectableRowsHideCheckboxes: true,
                viewColumns: false,
                // selectToolbarPlacement: 'above', commented out as we *want* to use replace instead!
                download: false,
                print: false,
                pagination: false,
                rowsSelected: props.rowsSelected,
                onRowSelectionChange: props.whenRowSelected,
                }}
            components={{
                TableToolbarSelect: props.SelectToolbar,
                }}
        />
    )
};

DataTable.defaultProps = {
    rowsSelected: [], // by default, no rows selected
}