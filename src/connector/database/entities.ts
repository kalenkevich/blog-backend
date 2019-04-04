import {User} from "../../module/user/model";
import {Post} from "../../module/post/model";
import {Comment} from "../../module/comment/model";
import {Category} from "../../module/category/model";
import {CommentRateUserAction, PostRateUserAction} from "../../module/rate/model";

export default [
  User,
  Post,
  Comment,
  Category,
  PostRateUserAction,
  CommentRateUserAction,
];
