import axios from "axios";
import { useState } from "react";
import swal from "sweetalert";

export default function Segment({ onClose }) {

    const schema = [
        { id : 1, label: "First Name", value: "first_name" },
        { id : 2, label: "Last Name", value: "last_name" },
        { id : 3, label: "Gender", value: "gender" },
        { id : 4, label: "Age", value: "age" },
        { id : 5, label: "Account Name", value: "account_name" },
        { id : 6, label: "City", value: "city" },
        { id : 7, label: "State", value: "state" },
    ]
    const [segmentName, setSegmentName] = useState("")
    const [inActiveSegmentList, setInActiveSegmentList] = useState([...schema])
    const [activeSegmentList, setActiveSegmentList] = useState([])
    const [selectedSegment, setSelectedSegment] = useState(-1)
    const inputHandle = (e) => {
        var id = e.target.id;
        var value = e.target.value;

        if(id == "select") {
            setSelectedSegment(value)
        }
        else if(id == "segment_name") {
            setSegmentName(value)
        }
    }
    const addSegment = () => {
        var tempActiveList = [...activeSegmentList, ...inActiveSegmentList.filter(data => data.value == selectedSegment)];
        var tempInActiveList = [...inActiveSegmentList.filter(data => data.value != selectedSegment)];
        tempActiveList.sort((a, b) => a.id - b.id);
        tempInActiveList.sort((a, b) => a.id - b.id);
        setActiveSegmentList(tempActiveList)
        setInActiveSegmentList(tempInActiveList)
        setSelectedSegment(-1)
    }
    const changeSegment = (e, oldData) => {
        var newData = e.target.value;
        if(newData != oldData) {
            var tempActiveList = [...activeSegmentList.filter(data => data.value != oldData), ...inActiveSegmentList.filter(data => data.value == newData)];
            var tempInActiveList = [...inActiveSegmentList.filter(data => data.value != newData), ...activeSegmentList.filter(data => data.value == oldData)];
            tempActiveList.sort((a, b) => a.id - b.id);
            tempInActiveList.sort((a, b) => a.id - b.id);
            setActiveSegmentList(tempActiveList)
            setInActiveSegmentList(tempInActiveList)
        }
    }

    const removeSegment = (segment) => {
        var tempActiveList = [...activeSegmentList.filter(data => data.value != segment)];
        var tempInActiveList = [...inActiveSegmentList, ...activeSegmentList.filter(data => data.value == segment)];
        tempActiveList.sort((a, b) => a.id - b.id);
        tempInActiveList.sort((a, b) => a.id - b.id);
        setActiveSegmentList(tempActiveList)
        setInActiveSegmentList(tempInActiveList)
    }
    
    const saveSegment = async () => {
        const data = {
            segment_name : segmentName,
            schema : activeSegmentList.map((schema) => ({[schema.value] : schema.label}))
        }
        await axios.post('https://webhook.site/e07287af-2657-4173-9a4a-d2041228b4d7', data, {
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then((response) => {
            swal("success", "success", "success")
            onClose();
        })
        .catch((error) => {
            swal("try again later", ":(", "warning")
            onClose();
        });
        
    }
    return (
            <div className="segment-container p-0 col-lg-4 col-md-6 border border-secondary ml-auto overflow-scroll">
                <div className="menu clearfix bg-primary mb-1 fit-c p-2 text-white">
                <svg onClick={onClose} xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="cursor-pointer float-start bi bi-chevron-left" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                </svg>
                <svg onClick={onClose} xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="cursor-pointer float-end bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
                </div>
                <div className="pt-2 px-4 d-grid h-100">
                <div className="top-container">
                    <div className="d-grid gap-2 fit-c">
                        <label for="segmentName">Enter the Name of the segment</label>
                        <input type="text" name="segmentName" value={segmentName} placeholder="Name of the Segment" id="segment_name" className="p-1" onChange={inputHandle} />
                    </div>
                    <p className="fit-c pt-2">To save your segment you need to add the schemas to build the query</p>
                    <div className="select-container fit-c d-grid gap-2">
                        
                            { activeSegmentList.length == 0 ? "" : 
                            <div className="d-grid gap-1 border border-primary p-3">
                            {activeSegmentList.map((data) => 
                                <div className="d-flex gap-1">
                                <select onChange={(e) => changeSegment(e, data.value)} value={data.value} className="btn w-100 border border-secondary rounded">
                                    <option value={data.value} >{data.label}</option>
                                    {inActiveSegmentList.map((data) => 
                                        <option value={data.value}>{data.label}</option>
                                    )}
                                </select>
                                <button className="btn btn-danger" onClick={() => removeSegment(data.value)}>-</button>
                                </div>
                            )}
                        </div>
                            }
                        <select id="select" className="p-2 fit-c text-center" value={selectedSegment} onChange={inputHandle}>
                            <option value={-1}>Add schema to segment</option>
                            {inActiveSegmentList.map((data) => 
                                <option value={data.value}>{data.label}</option>
                            )}
                        </select>
                        <a onClick={addSegment} className="link">+ Add new schema</a>
                    </div>
                </div>
                <div className="btn-container d-flex gap-2">
                    <button onClick={saveSegment} className="btn btn-success">Save the segment</button>
                    <button onClick={onClose} className="btn text-danger">cancel</button>
                </div>
                </div>
            </div>
    )
}