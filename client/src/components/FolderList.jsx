import { Box, Card, CardContent, List, Typography } from "@mui/material";
import React, { useState } from "react";
import NewFolder from "./NewFolder";
import { Link, useParams } from "react-router-dom";

const FolderList = ({ folders }) => {
    // css đang trỏ vô folder nào 
    const {folderId} = useParams(); // lấy id trên đường dẫn web về 

    const [activeFolderId, setActiveFolderId] = useState(folderId);



  return (
    <List
        sx={{
           width: '100%',
           bgcolor: '#ef5d5d',
           height: '100%',
           padding: '10px',
           textAlign: 'left',
           overflowY: "auto"
            
        }}
        subheader={
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography sx={{ fontWeight: 'bold', color: "white", mb: "5px"}}>
                    Folders
                </Typography>
                <NewFolder />
            </Box>
        }
    >
      {folders.map(({ id, name }) => {
        return (
          <Link
            key={id}
            to={`folders/${id}`}
            style={{ textDecoration: "none",   }}
            onClick={()=> setActiveFolderId(id)}
          >
            <Card sx={{ mb: "5px",backgroundColor: id === activeFolderId ? 'rgb(255 211 140)' : null }}>
              <CardContent
                sx={{ "&:last-child": { pb: "10px" }, padding: "10px" }}
              >
                <Typography sx={{fontSize: 16, fontWeight: "bold"}}>{name}</Typography>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </List>
  );
};

export default FolderList;
