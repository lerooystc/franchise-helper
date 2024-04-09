import React from "react";
import PartnerCard from "./PartnerCard";
import { Stack } from '@mui/material';

export default function PartnerList(props) {
  return (
    <Stack spacing={1}>
      {
        props.partners?.map(partner => {
          return <PartnerCard key={partner.id} data={partner} />
        })
      }
    </Stack>
  );
}