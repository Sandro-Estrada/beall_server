const merge = require("lodash.merge");
const {
  userSchema,
  userResolvers,
  courseSchema,
  courseResolvers,
  userMediaSchema,
  userMediaResolvers,
  userCourseSchema,
  userCourseResolvers,
} = require("./schemas");
/**
 * PRECAUCIÓN
 * EN EL ORDEN QUE SE DEFINA LOS SCHEMAS Y LOS RESOLVERS
 * AGREGAR EN DICHO ORDEN EN type Query o type Mutation
 */
const globalTypeDefs = `
    # The implementation for this scalar is provided by the
    # 'GraphQLUpload' export from the 'graphql-upload' package
    # in the resolver map below.
    scalar Upload
    scalar Date
    ${userSchema}
    ${courseSchema}
    ${userMediaSchema}
    ${userCourseSchema}
    type Query {
      # userSchema
      user: User
      login(email: String!, password: String!): Auth
      sendEmailToRecoverPassword(email: String!): Boolean
      # courseSchema 
      course(id: Int!): CourseView
      courses(title: String, category: Category): [Course]
      categories: [String]
      # userCourseSchema
      userCourses(title: String): [UserCourse]
    }
    type Mutation {
      # userSchema
      updateUserPassword(code: String!, password: String!): Boolean
      updateUser(input: UserUpdateInput): User
      createUser(input: UserInput): User
      activateUser(code: String!): Boolean
      # courseSchema
      saveCourseReview(input: CreateCourseReviewInput): CourseReview
      # course(id: Int!): Course
      # courses(title: String, category: String): [Course]
      # userMediaSchema
      uploadUserImage(file: Upload!): String
        # course(id: Int!): Course
        # courses(title: String, category: Int): [Course]
        # categories(): [Category]
    }
`;

module.exports = {
  globalTypeDefs,
  globalResolvers: merge(
    userResolvers,
    courseResolvers,
    userMediaResolvers,
    userCourseResolvers
  ),
};