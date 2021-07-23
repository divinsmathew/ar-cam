
  function up()
  {
    let tag = document.querySelector("body > a-scene > a-marker > a-entity")
    let scale = tag.getAttribute('scale').x
    scale += 0.05;
    tag.object3D.scale.set(scale, scale, scale);
  }
  function down()
  {
    let tag = document.querySelector("body > a-scene > a-marker > a-entity")
    let scale = tag.getAttribute('scale').x
    scale -= 0.05;
    tag.object3D.scale.set(scale, scale, scale);
  }