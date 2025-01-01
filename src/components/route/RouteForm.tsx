import React, { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { AttractionInput } from '../AttractionInput';
import CountrySelect from '../CountrySelect';
import CitySearch from '../CitySearch';

interface RouteFormProps {
  form: UseFormReturn<CreateRouteFormData>;
  selectedCountry: string | null;
  setSelectedCountry: (country: string | null) => void;
  onShowSummary: () => void;
}

function Geocoder({ onGeocode }) {
  const map = useMap();

  React.useEffect(() => {
    const geocoder = L.Control.Geocoder.nominatim();
    const control = L.Control.geocoder({
      query: '',
      placeholder: 'Search for a place...',
      geocoder,
      collapsed: false,
    })
      .on('markgeocode', function (e) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
          bbox.getSouthEast(),
          bbox.getNorthEast(),
          bbox.getNorthWest(),
          bbox.getSouthWest(),
        ]);
        map.fitBounds(poly.getBounds());
        onGeocode(e.geocode);
      })
      .addTo(map);

    return () => {
      control.remove();
    };
  }, [map, onGeocode]);

  return null;
}

export function RouteForm({ form, selectedCountry, setSelectedCountry, onShowSummary }: RouteFormProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const handleCountrySelect = (country: string | null) => {
    setSelectedCountry(country);
    form.setValue('country', country);
    form.setValue('city', null);
  };

  const handleGeocode = (geocode) => {
    setPosition([geocode.center.lat, geocode.center.lng]);
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazione</FormLabel>
              <FormControl>
                <CountrySelect onCountrySelect={handleCountrySelect} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Città</FormLabel>
              <FormControl>
                <CitySearch
                  onCitySelect={(city) => field.onChange(city)}
                  selectedCountry={selectedCountry}
                  disabled={!selectedCountry}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome del Percorso</FormLabel>
              <FormControl>
                <Input placeholder="Inserisci il nome del percorso" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attractionsCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numero di Attrazioni</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  placeholder="Inserisci il numero di attrazioni"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch('attractions')?.map((_, index) => (
          <AttractionInput key={index} index={index} form={form} />
        ))}

        <div className="flex justify-end">
          <Button type="button" onClick={onShowSummary} disabled={!isFormValid()}>
            Continua
          </Button>
        </div>

        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Geocoder onGeocode={handleGeocode} />
        </MapContainer>
      </form>
    </Form>
  );
}
