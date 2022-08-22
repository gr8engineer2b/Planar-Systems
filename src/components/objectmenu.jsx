import React, { useState, useEffect } from "react";
import { Box, Button, Grid } from "@mui/material";
import { red, orange, pink, deepOrange, green } from "@mui/material/colors";

const ObjectNav = (props) => {
  const sty = (color) => {
    return {
      backgroundColor: color,
      textAlign: "center",
      height: "100%",
      width: "100%",
      color: "text.primary",
      fontSize: "1em",
      textTransform: "none",
      overflow: "hidden",
    };
  };

  return (
    <Grid
      container
      spacing={1}
      width="calc(100% - 4vh)"
      height="5vh"
      margin="0 2vh"
    >
      {props.isTop ? (
        <Grid item xs={1} />
      ) : (
        <Grid item xs={1} height="100%" padding={1} key={crypto.randomUUID()}>
          <Button
            onClick={() => {
              props.prevView();
              props.setItems();
            }}
            sx={sty(green[700])}
          >
            Back
          </Button>
        </Grid>
      )}
      <Grid item xs={10} />
      <Grid item xs={1} height="100%" padding={1} key={crypto.randomUUID()}>
        <Button onClick={() => {}} sx={sty(green[700])}>
          New
        </Button>
      </Grid>
    </Grid>
  );
};

const ObjectButton = (props) => {
  const sty = (color) => {
    return {
      backgroundColor: color,
      textAlign: "center",
      height: "100%",
      width: "100%",
      color: "text.primary",
      fontSize: "1.8em",
      textTransform: "none",
      overflow: "hidden",
    };
  };

  if (props.isDir) {
    return (
      <Button
        onClick={() => {
          props.setViewData(props);
          props.setItems();
        }}
        sx={sty(props.color)}
      >
        {props.name}
      </Button>
    );
  } else {
    return (
      <Button onClick={() => props.setViewData(props)} sx={sty(props.color)}>
        {props.name}
      </Button>
    );
  }
};

const Folder = (props) => {
  const [items, setItems] = useState([]);

  const getFolderData = async () => {
    if (props.top) {
      setItems(props.top);
      if (props.top) props.top.map((item) => window.fs.createDir(item.name));
    } else {
      window.fs.readDir(props.path + props.name).then((data) => {
        if (JSON.stringify(items) !== JSON.stringify(data)) setItems(data);
      });
    }
  };

  useEffect(() => {
    getFolderData();
  }, [items]);

  return (
    <>
      <ObjectNav
        setItems={setItems}
        prevView={props.prevView}
        isTop={props.top ? true : false}
      />
      <Grid container spacing={2} padding="0 2.5vw 5vh 2.5vw" marginTop={0}>
        {items
          ? items.map((item) => {
              if (item == undefined) return;
              return (
                <Grid
                  item
                  xs={3}
                  height="calc(85vh / 4)"
                  key={crypto.randomUUID()}
                >
                  <ObjectButton
                    {...item}
                    prev={props}
                    path={props.path + props.name + "/"}
                    color={props.color ? props.color : item.color}
                    setViewData={props.setViewData}
                    setItems={setItems}
                  />
                </Grid>
              );
            })
          : ""}
      </Grid>
    </>
  );
};

const ObjectView = (props) => {
  const [item, setItem] = useState(props.item);

  useEffect(() => {
    if (!props.name) {
      return;
    }
    window.fs.readFile(props.path + props.name).then((data) => {
      setItem(JSON.parse(data));
    });
  }, []);

  return (
    <Grid container spacing={2} padding="5vh 2.5vw" marginTop={0}>
      {item
        ? Object.entries(item).map((prop) => {
            return (
              <Grid key={crypto.randomUUID()}>
                {prop[0]} = {prop[1]}
              </Grid>
            );
          })
        : "No Data"}
    </Grid>
  );
};

const ObjectMenu = () => {
  const [viewData, setViewData] = useState({});

  const topView = () => {
    setViewData({
      top: [
        { isDir: true, name: "Campaigns", color: pink[700] },
        { isDir: true, name: "Geography", color: pink[700] },
        { isDir: true, name: "Sessions", color: pink[700] },
        { isDir: true, name: "Characters", color: pink[700] },
        { isDir: true, name: "Planes", color: red[700] },
        { isDir: true, name: "Gods", color: red[700] },
        { isDir: true, name: "Lore", color: red[700] },
        { isDir: true, name: "Books", color: red[700] },
        { isDir: true, name: "Spells", color: deepOrange[700] },
        { isDir: true, name: "Items", color: deepOrange[700] },
        { isDir: true, name: "Monsters", color: deepOrange[700] },
        { isDir: true, name: "Tables", color: deepOrange[700] },
        { isDir: true, name: "Races", color: orange[700] },
        { isDir: true, name: "Classes", color: orange[700] },
        { isDir: true, name: "Feats", color: orange[700] },
        { isDir: true, name: "Backgrounds", color: orange[700] },
      ],
      isDir: true,
      name: "",
      path: "",
    });
  };

  const prevView = () => {
    viewData.top ? topView() : setViewData(viewData.prev);
  };

  useEffect(() => {
    topView();
  }, []);

  return (
    <Box height="100%">
      {viewData.isDir ? (
        <Folder
          refreshPeriod={5}
          setViewData={setViewData}
          prevView={prevView}
          {...viewData}
        />
      ) : (
        <ObjectView {...viewData} />
      )}
    </Box>
  );
};

export default ObjectMenu;
