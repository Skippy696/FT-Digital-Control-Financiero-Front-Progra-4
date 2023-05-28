/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import axios from 'axios';
import DashboardLayout from '../../../../layouts/dashboard';
import { AuthContext } from '../../../../auth/JwtContext';

Details.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

function Details() {
  const { accessToken } = useContext(AuthContext); // Obtiene el accessToken del AuthContext
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(`https://control-financiero.herokuapp.com/api/v1/invoice/${id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`, // Incluye el token de autenticación en el encabezado
        },
      });
      setInvoice(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  if (!invoice) {
    return null; // Render loading state or handle error
  }

  return (
    <>
      <Head>
        <title>Detalles de la Factura | FT Control Financiero</title>
      </Head>

      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph sx={{ mt: 3 }}>
          Detalles de la Factura
        </Typography>

        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  Nombre del cliente: {invoice.client_name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  Dirección: {invoice.address}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  Teléfono: {invoice.phone}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  Correo electrónico: {invoice.email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  Fecha de emisión: {formatDate(invoice.issue_date)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  Fecha de vencimiento: {formatDate(invoice.expiration_date)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  Número de factura: {invoice.invoice_number}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  Número de orden: {invoice.order_number}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => router.back()}
          >
            Volver
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Details;
