import React, { useEffect, useState } from "react";
import ObjectMenu from "./objectmenu.jsx";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Skeleton,
} from "@mui/material";
import SettingsService from '../services/SettingsService.js';

const DataExplorer = () => {

    const [hasWorkingDirectory, setHasWorkingDirectory] = useState(false);
    const [skeletonLines, setSkeletonLines] = useState();

    useEffect(() => {
        chooseDir();
        genSkeletonLines();
        window.addEventListener("resize", () => genSkeletonLines());
    }, []);

    const loadSettingsDir = async() => {
        await SettingsService.loadSettings();
        console.log(SettingsService.settings);
    }

    const chooseDir = async () => {
        await loadSettingsDir();
        if (SettingsService.settings.workspace) {
            setHasWorkingDirectory(true);
            await window.workspace.set(SettingsService.settings.workspace);
        }
        if (!SettingsService.settings.workspace) {
            const res = await window.workspace.choose();
            setHasWorkingDirectory(res[0]);
            SettingsService.settings.workspace = res[1];
            SettingsService.saveSettings();
        }
    };

    const genSkeletonLines = () => {
        let rows = skeletonLines;
        if (window.innerHeight) {
        rows = [];
        const num = (window.innerHeight * 0.7) / 27 - 1;
        for (let x = 0; x < num; x++) {
            rows.push(<Skeleton key={x} />);
        }
        setSkeletonLines(rows);
        }
    };

    return (
        <Box height="100%" bgcolor="background.default" color="text.primary">
            <Box height="100%">
                {hasWorkingDirectory ? (
                <ObjectMenu />
                ) : (
                <Box height="100%" padding={2}>
                    <Dialog open={true} height="20vh">
                    <DialogContent sx={{ padding: 0, backgroundColor: "#111" }}>
                        <Button
                        color="error"
                        variant="contained"
                        onClick={() => chooseDir()}
                        >
                        Select Directory to Continue
                        </Button>
                    </DialogContent>
                    </Dialog>
                    <Skeleton
                    component="div"
                    variant="rectangular"
                    sx={{
                        height: "2em",
                        borderRadius: 1,
                        marginBottom: 2,
                    }}
                    />
                    <Skeleton
                    variant="rectangular"
                    sx={{
                        width: "25vw",
                        minWidth: "180px",
                        float: "right",
                        height: "calc(100% - 6em)",
                        padding: "0 1em 1em 0",
                        borderRadius: 1,
                    }}
                    />
                    <div style={{ height: "2.5vh" }} display="block"></div>
                    <div style={{ padding: "1em", display: "flow-root" }}>
                    {skeletonLines}
                    <div style={{ height: "2.5vh" }}></div>
                    <Skeleton
                        variant="rectangular"
                        sx={{
                        height: "calc(30vh - 5em)",
                        borderRadius: 1,
                        }}
                    />
                    </div>
                </Box>
                )}
            </Box>
        </Box>
    )
};

export default DataExplorer;