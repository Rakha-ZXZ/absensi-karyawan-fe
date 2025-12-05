import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404</h1>
      <h2 style={styles.subHeader}>Halaman Tidak Ditemukan</h2>
      <p style={styles.text}>
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link to="/" style={styles.link}>
        Kembali ke Beranda
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    color: '#343a40',
  },
  header: {
    fontSize: '10rem',
    margin: 0,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  subHeader: {
    fontSize: '2rem',
    margin: '0 0 1rem 0',
  },
  text: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  link: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  },
};

export default NotFoundPage;