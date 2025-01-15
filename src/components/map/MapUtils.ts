export const isValidCoordinate = (coord: [number, number]): boolean => {
  if (!coord || !Array.isArray(coord) || coord.length !== 2) {
    console.warn('Invalid coordinate format:', coord);
    return false;
  }

  const [lat, lng] = coord;
  console.log(`Validating coordinates - lat: ${lat}, lng: ${lng}`);
  
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    console.warn('Coordinates must be numbers:', { lat, lng });
    return false;
  }

  const isValid = !isNaN(lat) && !isNaN(lng) && 
                 Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

  if (!isValid) {
    console.warn('Coordinate values out of range:', { lat, lng });
  }

  return isValid;
};

export const validatePoints = (points: [number, number][]): boolean => {
  console.log('Validating points array:', points);
  return points.length >= 2 && points.every(isValidCoordinate);
};