const axios = require("axios").default;
export interface School {
  id: String;
  name: String;
}

export interface TeacherNode {
  _typename?: String; // unused
  avg_difficulty: number;
  avg_rating: number;
  department: String;
  first_name: String;
  last_name: String;
  legacy_id: number;
  id: String;
  is_saved: boolean;
  num_ratings: number;
  // TODO : test this
  school: School;
  would_take_again_percent: number;
}

export interface TeacherSearch {
  cursor: String;
  node: TeacherNode;
}

export interface ProfessorRating {
  avg_rating: number;
  avg_difficulty: number;
  would_take_again_percent: number;
  num_ratings: number;
  formatted_name: String;
  department: String;
  college_name: String;
  link: String;
}

export interface Department {
  id: String;
  name: String;
}

export interface SchoolSummary {
  campus_condition?: number;
  campus_location?: number;
  career_opportunities: number;
  club_and_event_activities?: number;
  food_quality?: number;
  internet_speed?: number;
  library_condition?: number;
  school_reputation?: number;
  school_safety?: number;
  school_satisfaction?: number;
  social_activities?: number;
}

// NOTE : this is what the data should be broken down into
export interface SchoolNode {
  avg_rating_rounded: number;
  city: String;
  // departments: Department[]; // array of interface
  id: String;
  legacy_id: number;
  name: String;
  num_ratings: number;
  state: String;
  summary: SchoolSummary;
}

export interface SchoolSearch {
  school_node: SchoolNode[];
  department_map: Map<string, Department[]>;
}

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.5",
  "Content-Type": "application/json",
  Authorization: "Basic dGVzdDp0ZXN0",
  "Sec-GPC": "1",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  Priority: "u=4",
};

// const API_LINK: String = "https://www.ratemyprofessors.com/graphql";
const TEACHER_COMMENTS: String = `\"query TeacherRatingsPageQuery($id: ID!) {
        node(id: $id) {
            __typename
            ... on Teacher {
                firstName
                lastName
                department
                ratings(first: 1000) {
                    edges {
                        node {
                            comment
                            class
                            date
                            helpfulRating
                            difficultyRating
                            grade
                            wouldTakeAgain
                            ratingTags
                        }
                    }
                }
            }
        }
    }"`;

const GET_TEACHER_ID_QUERY: String = `\"query TeacherSearchResultsPageQuery(
        $query: TeacherSearchQuery!
        $schoolID: ID
        $includeSchoolFilter: Boolean!
    ) {
        search: newSearch {
            teachers(query: $query, first: 1) {
                edges {
                    node {
                        id
                        firstName
                        lastName
                    }
                }
            }
        }
        school: node(id: $schoolID) @include(if: $includeSchoolFilter) {
            __typename
            ... on School {
                name
            }
            id
        }
    }"`;
const TEACHER_BODY_QUERY: String = `\"query TeacherSearchResultsPageQuery(
  $query: TeacherSearchQuery!
  $schoolID: ID
  $includeSchoolFilter: Boolean!
) {
  search: newSearch {
    ...TeacherSearchPagination_search_1ZLmLD
  }
  school: node(id: $schoolID) @include(if: $includeSchoolFilter) {
    __typename
    ... on School {
      name
    }
    id
  }
}

fragment TeacherSearchPagination_search_1ZLmLD on newSearch {
  teachers(query: $query, first: 8, after: "") {
    didFallback
    edges {
      cursor
      node {
        ...TeacherCard_teacher
        id
        __typename
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    resultCount
    filters {
      field
      options {
        value
        id
      }
    }
  }
}

fragment TeacherCard_teacher on Teacher {
  id
  legacyId
  avgRating
  numRatings
  ...CardFeedback_teacher
  ...CardSchool_teacher
  ...CardName_teacher
  ...TeacherBookmark_teacher
}

fragment CardFeedback_teacher on Teacher {
  wouldTakeAgainPercent
  avgDifficulty
}

fragment CardSchool_teacher on Teacher {
  department
  school {
    name
    id
  }
}

fragment CardName_teacher on Teacher {
  firstName
  lastName
}

fragment TeacherBookmark_teacher on Teacher {
  id
  isSaved
}"`;

const TEACHER_LIST_QUERY: String = `\"query TeacherSearchResultsPageQuery(
        $query: TeacherSearchQuery!
        $schoolID: ID
        $includeSchoolFilter: Boolean!
    ) {
        search: newSearch {
            teachers(query: $query, first: 1000, after: "") {
                edges {
                    node {
                        id
                        legacyId
                        firstName
                        lastName
                        department
                        avgRating
                        numRatings
                        wouldTakeAgainPercent
                        avgDifficulty
                        school {
                            name
                            id
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
                resultCount
            }
        }
        school: node(id: $schoolID) @include(if: $includeSchoolFilter) {
            __typename
            ... on School {
                name
            }
            id
        }
    }"`;

// const SCHOOL_BODY_QUERY: String = `\"query NewSearchSchoolsQuery(
//   $query: SchoolSearchQuery!
// ) {
//   newSearch {
//     schools(query: $query) {
//       edges {
//         cursor
//         node {
//           id
//           legacyId
//           name
//           city
//           state
//           departments {
//             id
//             name
//           }
//           numRatings
//           avgRatingRounded
//           summary {
//             campusCondition
//             campusLocation
//             careerOpportunities
//             clubAndEventActivities
//             foodQuality
//             internetSpeed
//             libraryCondition
//             schoolReputation
//             schoolSafety
//             schoolSatisfaction
//             socialActivities
//           }
//         }
//       }
//       pageInfo {
//         hasNextPage
//         endCursor
//       }
//     }
//   }
// }"`;

const SCHOOL_BODY_QUERY = `\"query NewSearchSchoolsQuery(\\n  $query: SchoolSearchQuery!\\n) {\\n  newSearch {\\n    schools(query: $query) {\\n      edges {\\n        cursor\\n        node {\\n          id\\n          legacyId\\n          name\\n          city\\n          state\\n          departments {\\n            id\\n            name\\n          }\\n          numRatings\\n          avgRatingRounded\\n          summary {\\n            campusCondition\\n            campusLocation\\n            careerOpportunities\\n            clubAndEventActivities\\n            foodQuality\\n            internetSpeed\\n            libraryCondition\\n            schoolReputation\\n            schoolSafety\\n            schoolSatisfaction\\n            socialActivities\\n          }\\n        }\\n      }\\n      pageInfo {\\n        hasNextPage\\n        endCursor\\n      }\\n    }\\n  }\\n}\\n\"`;

// Promise<Department[]>
export async function search_school(schoolName: String): Promise<SchoolSearch> {
  // const variables = {
  //   query: {
  //     text: schoolName,
  //   },
  // };
  // const payload = {
  //   query: SCHOOL_BODY_QUERY,
  //   variables: variables,
  // };

  const response = await fetch("https://www.ratemyprofessors.com/graphql", {
    credentials: "include",
    headers: HEADERS,
    body: `{\"query\":${SCHOOL_BODY_QUERY},\"variables\":{\"query\":{\"text\":\"${schoolName}\"}}}`,
    method: "POST",
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error("Network response from RMP not OK");
  }

  const data = await response.json();
  const school_search_array = data.data.newSearch.schools.edges;
  const SchoolNode_data: SchoolNode[] = [];
  // const departments: Department[] = [];

  // create a hashmap that will map the college and city to the departments
  // key will be tuple of values
  let college_to_department_map: Map<string, Department[]> = new Map();

  for (const data of school_search_array) {
    const school_node_instance: SchoolNode = {
      avg_rating_rounded: parseFloat(data["node"]["avgRatngRounded"]),
      city: data["node"]["city"],
      id: data["node"]["id"],
      legacy_id: data["node"]["legacyId"],
      name: data["node"]["name"],
      num_ratings: data["node"]["numRatings"],
      state: data["node"]["state"],
      summary: data["node"]["summary"],
    };
    college_to_department_map[data["node"]["name"]] =
      data["node"]["departments"];

    college_to_department_map.set(
      data["node"]["name"],
      data["node"]["departments"]
    );
    // console.log(`Created instance data\n ${school_node_instance}`);
    SchoolNode_data.push(school_node_instance);
  }

  // print out the keys
  // college_to_department_map.forEach((value, key) => {
  //   console.log(key);
  //   console.log(value);
  // });
  const return_data: SchoolSearch = {
    school_node: SchoolNode_data,
    department_map: college_to_department_map,
  };

  return return_data;
}

// this function will filter based on the raw school data and the original name of the school
// this function should return a filtered version of the SchoolSearch object
export async function filter_school(
  raw_school_data: SchoolSearch,
  original_school_name: string
): Promise<SchoolSearch> {
  const filtered_school_data: SchoolNode[] = [];
  const filtered_department_map: Map<string, Department[]> = new Map();
  for (const individual_schools of raw_school_data.school_node) {
    if (individual_schools["name"] == original_school_name) {
      filtered_school_data.push(individual_schools);
    }

    // indicate that filtered school data has been found
    // console.log(`Found filtered school data : ${filtered_school_data}`);
  }

  // same filtering logic applies for department as well
  // but we can use the forEach method
  raw_school_data.department_map.forEach((value, key) => {
    console.log(`current key is : ${key}`);

    // means original college has been found
    if (key == original_school_name) {
      filtered_department_map.set(key, value);
    }
  });
  // console.log(filtered_school_data);
  // console.log(filtered_department_map);

  const resulting_filtered_data: SchoolSearch = {
    school_node: filtered_school_data,
    department_map: filtered_department_map,
  };

  return resulting_filtered_data;
}

// TODO : Define and filter out the departments into an array and store it in the form of an array
// use this as playground for testing
export async function test_interface() {
  const school_instance = {
    id: "some other id",
    name: "name of school",
  };
  const teacher_node_instance: TeacherNode = {
    avg_difficulty: 10,
    avg_rating: 10,
    department: "unknown",
    first_name: "some first name",
    last_name: "some last name",
    legacy_id: 10,
    id: "Some id",
    is_saved: false,
    num_ratings: 10,
    school: school_instance,
    would_take_again_percent: 10.0,
  };
  // console.log(teacher_node_instance);
}
