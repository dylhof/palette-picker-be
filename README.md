# Palette Picker Back End

## Schema:
![Schema](./images/palette-picker-schema.png)

## API Calls
### Base URL
  > The Colorations API is hosted at ```https://palette-picker-be.herokuapp.com/``` 
  which should be used as the base URL for API requests
### GET
  > There are four endpoints to get data, two for Projects and two for Palettes.

#### ```GET /api/v1/projects```
  >This endpoint will return all available projects in.

**Example Response:**
```
[
  {
    "id": 1,
    "name": "Game Time",
    "created_at": "2019-03-23T18:13:25.614Z",
    "updated_at": "2019-03-23T18:13:25.614Z"
  },
  {
    "id": 2,
    "name": "Movie Tracker",
    "created_at": "2019-03-23T18:13:25.631Z",
    "updated_at": "2019-03-23T18:13:25.631Z"
  }
]
```
#### Optional Query parameter: ```?name=nameValue```
  >This query parameter will return any projects that includes the value given as the nameValue.

Request: ```/api/v1/projects?name=ame```

**Example Response:**
```
[
  {
    "id": 1,
    "name": "Game Time",
    "created_at": "2019-03-23T18:13:25.614Z",
    "updated_at": "2019-03-23T18:13:25.614Z"
  }
]
```

Request: ```/api/v1/projects?name=Game%20%Time```

  >Would get the same response as above query parameter

#### ```GET /api/v1/projects/:id```
  >This endpoint will return a specific project that matches the id parameter.

Request: ```/api/v1/projects/1```

**Example Response:**
```
{
  "id": 1,
  "name": "Game Time",
  "created_at": "2019-03-23T18:13:25.614Z",
  "updated_at": "2019-03-23T18:13:25.614Z"
}
```

### ```GET /api/v1/palettes/:id```
  >This endpoint will return a specific palette that matches the id parameter

Request: ```/api/v1/palettes/2```

**Example Response:**

```
{
  "id": 2,
  "name": "Favorite Colors",
  "color1": "#FCB97D",
  "color2": "#EDD892",
  "color3": "#C6B89E",
  "color4": "#B5B8A3",
  "color5": "#AABA9E",
  "project_id": 1,
  "created_at": "2019-03-23T18:13:25.664Z",
  "updated_at": "2019-03-23T18:13:25.664Z"
}
```

#### ```GET /api/v1/projects/:id/palettes```
  >This endpoint will return all palettes for a specific project that matches the id parameter.

Request: ```/api/v1/projects/2/palettes```

**Example Response:**

```
[
  {
    "id": 3,
    "name": "Lush",
    "color1": "#0EF9F9",
    "color2": "#1F81DD",
    "color3": "#6151BC",
    "color4": "#9B5094",
    "color5": "#FF5C1C",
    "project_id": 2,
    "created_at": "2019-03-23T18:13:25.675Z",
    "updated_at": "2019-03-23T18:13:25.675Z"
  },
  {
    "id": 4,
    "name": "Pale",
    "color1": "#BCF8EC",
    "color2": "#AED9E0",
    "color3": "#91A6E0",
    "color4": "#8B687F",
    "color5": "#7B435B",
    "project_id": 2,
    "created_at": "2019-03-23T18:13:25.682Z",
    "updated_at": "2019-03-23T18:13:25.682Z"
  }
]
```

### POST
  > There are two endpoints to create new data, one for Projects and one for Palettes. Upon success, both return the ``` id``` of the newly created Project or Palette.

#### ```POST api/v1/projects```
  >This endpoint will add a project to the data base.  Names for projects must be unique in the data base.

**Required Input for Request Body:**


| Name       | Type          | Description  |
| ------------- | ------------- | ----- |
| `name`      | `string` | Name of the Project |

**Example Request Body:**
```
{
  name: 'Dog Party'
}
```
#### ```POST api/v1/palettes```
  >This endpoint will add a palette to the data base.

**Required Input for Request Body:**

| Name      | Type      | Description|
|-----------|-----------|------------|
|`name`     | `string`  | Name of the Palette|
|`color1`   | `string`  | Hex code for color 1|
|`color2`   | `string`  | Hex code for color 2|
|`color3`   | `string`  | Hex code for color 3|
|`color4`   | `string`  | Hex code for color 4|
|`color5`   | `string`  | Hex code for color 5|
|`project_id`   | `integer`  | ID of Project that the palette belongs to - used as the foreign key|

### PUT
  > There are two endpoints to edit data, one for Projects and one for Palettes.

#### ```PUT api/v1/projects/:id```
  >This endpoint will edit the project that matches the id parameter.

**Required Input for Request Body:**


| Name       | Type          | Description  |
| ------------- | ------------- | ----- |
| `name`      | `string` | Edited name of the Project |

**Example Request Body:**
```
{
  name: 'Number Guesser'
}
```
#### ```PUT api/v1/palettes/:id```
  >This endpoint will edit a palette that matches the id parameter.

**Required Input for Request Body:**

| Name      | Type      | Description|
|-----------|-----------|------------|
|`name`     | `string`  | Name of the Palette|
|`color1`   | `string`  | Hex code for color 1|
|`color2`   | `string`  | Hex code for color 2|
|`color3`   | `string`  | Hex code for color 3|
|`color4`   | `string`  | Hex code for color 4|
|`color5`   | `string`  | Hex code for color 5|
|`project_id`   | `integer`  | ID of Project that the palette belongs to - used as the foreign key|

### Delete
  > There are two endpoints to delete data, one for Projects and one for Palettes.

#### ```DELETE api/v1/projects/:id```
  >This endpoint will delete the project that matches the id parameter.

#### ```DELETE api/v1/palettes/:id```
  >This endpoint will delete a palette that matches the id parameter.

