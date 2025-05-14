import tales from "../mocks/taleInfo";

export const fetchAllTales = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tales);
    }, 1000);
  });
};

export const fetchAllMyTales = async (id: number) => {
  return new Promise((resolve, rejcet) => {
    const tale = tales.find((t) => t.id === id);
    setTimeout(() => {
      tale ? resolve(tale) : rejcet("Tale not found");
    }, 1000);
  });
};

export const fetchTaleById = async (id: number) => {
  return new Promise((resolve, reject) => {
    const tale = tales.find((t) => t.id === id);
    setTimeout(() => {
      tale ? resolve(tale) : reject("Tale not found");
    }, 1000);
  });
};

export const fetchTalesByCategory = async () => {
  return new Promise(() => {
    setTimeout(() => {}, 1000);
  });
};

/*
{
    "folktales": [
        {
            "id": 1,
            "title": "설문대할망",
            "location" : {
		            "latitude" : 30.123,
		            "longitude" : 10.987
            },
            "category" : ["PIONEERING", "PERSONALITY"]
        },
        {
            "id": 2,
            "title": "문전본풀이",
            "location" : {
		            "latitude" : 30.123,
		            "longitude" : 10.987
            },
            "category" : ["ROMANCE", "FAITH"]
        },
        {
            "id": 3,
            "title": "세경본풀이",
            "location" : {
		            "latitude" : 30.123,
		            "longitude" : 10.987
            },
            "category" : ["ROMANCE"]
        }
    ],
    "listSize": 3,
    "totalPage": 1,
    "totalElements": 3,
    "first": true,
    "last": true
}
*/
