import React, { Component } from 'react';
import { Table } from 'antd';
import * as nfetch from 'node-fetch';
import querystring from 'querystring';

import 'antd/dist/antd.css';
import 'antd/dist/antd.dark.min.css';

const columns = [
    {
        title: "Avatar",
        dataIndex: "avatar",
        render: (avatar) => <img style={{borderRadius: '100%'}}width={32} height={32} src={avatar} />
    },
    {
        title: "Nombre",
        dataIndex: "nombre",
        sorter: true,
        //render: (nombre) => `${nombre} ${apellido}`,
        width: "20%"
    },
    {
        title: "Genero",
        dataIndex: "genero",
        filters: [
            { text: "Masculino", value: "M" },
            { text: "Femenino", value: "F" },
            { text: "No binario", value: "O" },
        ],
        width: "20%"
    },
    {
        title: "Correo",
        dataIndex: "email"
    }
];

const getRandomuserParams = (params) => ({
    results: params.pagination.pageSize,
    page: params.pagination.current,
    ...params
});

class Content extends Component {
    state = {
        data: [],
        pagination: {
            current: 1,
            pageSize: 10,
            position: ['bottomCenter']
        },
        loading: false
    };

    componentDidMount() {
        const { pagination } = this.state;
        this.fetch({ pagination });
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.fetch({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination,
            ...filters
        });
    };

    fetch = (inParams = {}) => {
        this.setState({ loading: true });
        let params = getRandomuserParams(inParams);
        let getParams = querystring.encode(params);
        //let url = "https://randomuser.me/api?";
        let url = 'https://noesishosting.com/sw/loremdata/?a=rs&p=nombre,apellido,genero,email,color,fecha,avatar:100';
        nfetch( url + getParams, {
            method: "get",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(rslt => rslt.json())
        .then((data) => {
            console.log(data);
            this.setState({
                loading: false,
                data: data.rs,
                pagination: {
                    ...params.pagination,
                    total: 200
                    // 200 is mock data, you should read it from server
                    // total: data.totalCount
                }
            });
        });
    };

    render() {
        const { data, pagination, loading } = this.state;
        return (
            <Table
                size='small'
                columns={columns}
                rowKey={(record, i) => i}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={this.handleTableChange}
                scroll={{ y: 240 }}
            />
        );
    }
}

export default Content;