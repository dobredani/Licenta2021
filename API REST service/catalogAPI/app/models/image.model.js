const sql = require("./db.js");

// constructor
const Image = function(image) {
  this.fk_olx_ad_id = image.fk_olx_ad_id;
  this.image_path = image.image_path;
  this.image_url = image.image_url;
  this.label = image.label;
};

Image.create = (newImage, result) => {
  sql.query("INSERT INTO rawimages SET ?", newImage, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created image: ", { id: res.insertId, ...newImage });
    result(null, { id: res.insertId, ...newImage });
  });
};

Image.findById = (imageId, result) => {
  sql.query(`SELECT * FROM images WHERE id = ${imageId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found image: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Image with the id
    result({ kind: "not_found" }, null);
  });
};

Image.getAll = result => {
  sql.query("SELECT * FROM images", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("images: ", res);
    result(null, res);
  });
};

Image.updateById = (id, image, result) => {
  sql.query(
    "UPDATE images SET email = ?, name = ?, active = ? WHERE id = ?",
    [image.email, image.name, image.active, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Image with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated image: ", { id: id, ...image });
      result(null, { id: id, ...image });
    }
  );
};

Image.remove = (id, result) => {
  sql.query("DELETE FROM images WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Image with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted image with id: ", id);
    result(null, res);
  });
};

Image.removeAll = result => {
  sql.query("DELETE FROM images", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} images`);
    result(null, res);
  });
};

module.exports = Image;