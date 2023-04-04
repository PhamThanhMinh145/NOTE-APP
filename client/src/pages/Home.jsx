import React from "react";
import { Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import UserMenu from "../components/UserMenu";
import FolderList from "../components/FolderList";
import { Outlet, useLoaderData } from "react-router-dom";
import PushNotification from "../components/PushNotification";

const Home = () => {
    // lấy data từ loader 
    const {folders} = useLoaderData();
    // console.log("Home Page", {folders} );


  return (
    <>
      <Container maxWidth="lg" sx={{ textAlign: "center", marginTop: "50px" }}>
        <Typography variant="h4" sx={{ mb: "20px" }}>
          Note App
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "right", mb: "10px" }}>
          <UserMenu />
          <PushNotification />
        </Box>
        <Grid
          container
          sx={{
            height: "50vh",
            borderRadius: "1rem",
            boxShadow: "0 0 15px 0 rgb(193 193 193 / 70%)",
          }}
        >
          <Grid item xs={3} sx={{ height: "100%" }}>
            <FolderList
              folders={folders}
            />
          </Grid>
          <Grid item xs={9} sx={{ height: "100%" }}>
            {/* route to link of NoteList.jsx in children route /home of index.jsx*/}
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
