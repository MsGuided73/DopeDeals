export type TuningTag = 'Flavor'|'Balance'|'Clouds';
export type CollectionTile = { title:string; href:string; img:string; blurb?:string; tag?:TuningTag; size?:'feature'|'wide'|'small' };
export type Product = { id: string; title: string; price: number; image_url: string; best_for?: TuningTag; memberPrice?: number | null };

