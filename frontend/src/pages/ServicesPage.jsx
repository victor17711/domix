import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Images,
  ArrowLeft,
  Search,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

const ServicesPage = () => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const albums = [
    {
      id: 1,
      title: 'Montaj produse',
      cover: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
      images: [
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 2,
      title: 'Lucrări interioare',
      cover: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
      images: [
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 3,
      title: 'Fațade și exterior',
      cover: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 4,
      title: 'Proiecte finalizate',
      cover: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 5,
      title: 'Renovări moderne',
      cover: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
      images: [
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 6,
      title: 'Amenajări complete',
      cover: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80',
      images: [
        'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 7,
      title: 'Spații comerciale',
      cover: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
      images: [
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80'
      ]
    },
    {
      id: 8,
      title: 'Execuții premium',
      cover: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
      images: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80'
      ]
    }
  ];

  const imageHeights = [
    'h-[220px]',
    'h-[300px]',
    'h-[260px]',
    'h-[340px]',
    'h-[240px]',
    'h-[320px]'
  ];

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showPrevImage = () => {
    if (!selectedAlbum) return;
    setLightboxIndex((prev) =>
      prev === 0 ? selectedAlbum.images.length - 1 : prev - 1
    );
  };

  const showNextImage = () => {
    if (!selectedAlbum) return;
    setLightboxIndex((prev) =>
      prev === selectedAlbum.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-10 md:py-14">
        <div className="w-full px-6">
          <div className="flex items-center gap-3 mb-3">
            <Images className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Servicii</h1>
          </div>
          <p className="text-teal-100">
            Descoperă albumele cu lucrările și proiectele noastre
          </p>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="bg-white border-b">
        <div className="w-full px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-teal-600">
              Acasă
            </Link>

            <ChevronRight className="w-4 h-4" />

            {!selectedAlbum ? (
              <span className="text-gray-900 font-semibold">Servicii</span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlbum(null);
                    setLightboxIndex(null);
                  }}
                  className="hover:text-teal-600 font-semibold transition"
                >
                  Servicii
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-semibold">
                  {selectedAlbum.title}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-12">
        {!selectedAlbum ? (
          <>
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Albume servicii
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Apasă pe un album pentru a vedea imaginile din galerie
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => {
                    setSelectedAlbum(album);
                    setLightboxIndex(null);
                  }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 text-left border border-gray-200 hover:border-teal-500"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="w-full h-[260px] object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold mb-2">
                        {album.images.length} imagini
                      </div>
                      <h3 className="text-white text-xl font-bold leading-tight">
                        {album.title}
                      </h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedAlbum.title}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedAlbum.images.length} imagini în acest album
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedAlbum(null);
                  setLightboxIndex(null);
                }}
                className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-3 rounded-xl hover:bg-teal-700 transition font-semibold w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                Înapoi la servicii
              </button>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
              {selectedAlbum.images.map((image, index) => (
                <div key={index} className="mb-6 break-inside-avoid">
                  <button
                    type="button"
                    onClick={() => openLightbox(index)}
                    className="group relative block w-full overflow-hidden rounded-[15px]"
                  >
                    <img
  src={image}
  alt={`${selectedAlbum.title} ${index + 1}`}
  className="w-full h-auto rounded-[15px] shadow-lg hover:shadow-xl transition"
/>

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition duration-300 rounded-[15px] flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition duration-300 shadow-lg">
                        <Search className="w-6 h-6 text-gray-900" />
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* LIGHTBOX */}
      {selectedAlbum && lightboxIndex !== null && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={showPrevImage}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          <div className="max-w-6xl w-full flex flex-col items-center">
            <img
              src={selectedAlbum.images[lightboxIndex]}
              alt={`${selectedAlbum.title} ${lightboxIndex + 1}`}
              className="max-h-[82vh] w-auto max-w-full object-contain rounded-[18px] shadow-2xl"
            />

            <div className="mt-4 text-center text-white">
              <div className="font-semibold text-lg">{selectedAlbum.title}</div>
              <div className="text-sm text-white/75">
                Imaginea {lightboxIndex + 1} din {selectedAlbum.images.length}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={showNextImage}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <ChevronRightIcon className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;