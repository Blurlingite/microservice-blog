import React from "react";

interface Comment {
  id: string;
  content: string;
}
export default ({ comments }: { comments: Comment[] }) => {
  const renderedComments = comments.map((comment) => {
    const someComment: Comment = comment as Comment;

    return <li key={someComment.id}>{someComment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};
