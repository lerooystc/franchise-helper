import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Grid, Button } from "@mui/material";
import { get_news } from "../network";
import NewsCard from "./NewsCard";

export default function News() {
  const { page } = useParams();
  const [prev, setPrev] = useState([]);
  const [articles, setArticles] = useState([]);
  const [next, setNext] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await get_news(page);
      setArticles(data.results);
      setPrev(data.previous);
      setNext(data.next);
      document.querySelector("#main").style.position = "static";
    })();

    return () => {
      document.querySelector("#main").style.position = "fixed";
    };
  }, [page]);

  return (
    <Grid container spacing={8} alignItems="center" justifyContent="center">
      <Grid item xs={12}>
        <Grid container spacing={4} justifyContent="center">
          {
            articles?.map(article => {
              return (
                <Grid item key={article.id} xs={4} align="center">
                  <NewsCard data={article} />
                </Grid>)
            })
          }
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4} justifyContent="center">
          <Button to={'/news/' + (parseInt(page)-1)} component={Link} disabled={!prev}>Prev</Button>
          <Button to={'/news/' + (parseInt(page)+1)} component={Link} disabled={!next}>Next</Button>
        </Grid>
      </Grid>
    </Grid>
  )
}