Expected Shape:
{
    "type": "FeatureCollection"
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id" //Property id or code : string,
                "propertyType : "House", "Condo", etc...,
                "transactionType" : "Rent", "Sale",
                "location" : string,
                "name" : string,
                "price" : number,
            },
            "geometry": {
                "type" : "Point",
                "coordinates" : [number, number]
            }
        },
    ]
}