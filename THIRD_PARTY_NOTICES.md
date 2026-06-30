# Third-Party Notices

This application uses open-source software and open map data. Below are the
components that power the map and address search, with license and usage notes.

## Map display

### MapLibre GL JS

- **Use:** Interactive map rendering
- **License:** [BSD-3-Clause](https://github.com/maplibre/maplibre-gl-js/blob/main/LICENSE.txt)
- **Project:** https://maplibre.org/

### react-map-gl

- **Use:** React bindings for MapLibre
- **License:** MIT
- **Project:** https://github.com/visgl/react-map-gl

### OpenFreeMap

- **Use:** Hosted vector map tiles (`tiles.openfreemap.org`)
- **License:** MIT (tile service); map data from OpenStreetMap
- **Project:** https://openfreemap.org/
- **Attribution:** Required for OpenStreetMap data. MapLibre displays this on the map.

### OpenStreetMap

- **Use:** Map data (via OpenFreeMap tiles)
- **License:** [Open Database License (ODbL) 1.0](https://openstreetmap.org/copyright)
- **Requirement:** Display **© OpenStreetMap contributors** when showing the map.

## Geocoding (address search)

### Default: OpenStreetMap Nominatim

- **Use:** Converting addresses to coordinates
- **Policy:** https://operations.osmfoundation.org/policies/nominatim/
- **Requirements:**
  - Valid `User-Agent` identifying the application (configured in code)
  - **Maximum 1 request per second** (enforced in app code)
  - Not for bulk or autocomplete-at-scale use

### Optional: LocationIQ

- **Use:** Alternative geocoder when `GEOCODING_PROVIDER=locationiq` and `LOCATIONIQ_API_KEY` are set
- **Data:** OpenStreetMap-based
- **Terms:** https://locationiq.com/terms
- **Free tier:** Higher daily limits than public Nominatim (see LocationIQ pricing)

## Other dependencies

Runtime npm packages (Next.js, Prisma, PostgreSQL client, etc.) retain their
licenses in `node_modules/<package>/package.json`. Run `npm ls --all` for the
full dependency tree.

## App license

Application source code is private / community use unless otherwise stated by
the project owner.
