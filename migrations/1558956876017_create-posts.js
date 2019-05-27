exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("blog_posts", {
        id: { type: "text", notNull: true },
        posttitle: { type: "text", notNull: true },
        postbody: { type: "text", notNull: true },
        postpicture: { type: "text", notNull: true },
        tags: { type: "text[]", notNull: true},
        createdAt: {
          type: "timestamp",
          notNull: true,
          default: pgm.func("current_timestamp")
        }
      });
};

exports.down = (pgm) => {
};
