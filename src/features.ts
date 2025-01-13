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
  console.log(teacher_node_instance);
}
