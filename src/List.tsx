import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Table, Tag } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function List() {



    
return (
<div>
    <h1>List</h1>
    <Table columns={columns} dataSource={data} />
</div>
);
}