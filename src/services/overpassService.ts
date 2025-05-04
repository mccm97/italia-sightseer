
interface OverpassAttractionNode {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    'name:en'?: string;
    tourism?: string;
    historic?: string;
    amenity?: string;
    [key: string]: string | undefined;
  };
}

interface OverpassResponse {
  elements: OverpassAttractionNode[];
}

export interface OverpassAttraction {
  name: string;
  source: 'overpass';
  lat: number;
  lng: number;
  type: string;
  id: number;
}

export async function fetchAttractionsFromOverpass(
  city: string,
  country: string
): Promise<OverpassAttraction[]> {
  try {
    console.log(`Fetching attractions from Overpass for ${city}, ${country}`);
    
    // Build Overpass query for tourist attractions, historic sites, and monuments
    const query = `
      [out:json];
      area["name"="${city}"]["admin_level"~"8|6|4"]["boundary"="administrative"];
      (
        node["tourism"~"attraction|museum|gallery|artwork|viewpoint"]["name"](area);
        node["historic"~"monument|memorial|archaeological_site|castle|ruins|fort"]["name"](area);
        node["amenity"~"place_of_worship|theatre|cinema"]["name"](area);
      );
      out body;
    `;

    const encodedQuery = encodeURIComponent(query);
    const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Overpass API returned status ${response.status}`);
    }
    
    const data: OverpassResponse = await response.json();
    console.log('Overpass raw data:', data);
    
    // Transform the response into our attraction format
    const attractions: OverpassAttraction[] = data.elements
      .filter(element => element.tags && element.tags.name) // Ensure it has a name
      .map(element => {
        const type = element.tags.tourism || element.tags.historic || element.tags.amenity || 'attraction';
        return {
          name: element.tags['name:en'] || element.tags.name || '',
          source: 'overpass' as const,
          lat: element.lat,
          lng: element.lon,
          type,
          id: element.id
        };
      });
    
    console.log(`Found ${attractions.length} attractions from Overpass`);
    return attractions;
    
  } catch (error) {
    console.error('Error fetching attractions from Overpass:', error);
    return [];
  }
}
