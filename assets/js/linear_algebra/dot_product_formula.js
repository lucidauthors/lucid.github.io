let dot_product_formula = (function() {

let origin = [150, 140], 
    scale = 60, 
    scatter = [], 
    axis = [],
    expectedAxis = [],
    beta = 0, alpha = 0, 

    startAngleX = Math.PI/8 * 2.65,
    startAngleY = -Math.PI/8,
    startAngleZ = Math.PI/8 * 0.6,

    axis_len = 2,
    unit = axis_len/10,
    
    svg = d3.select("#svg_dot_product_formula");

let lib = space_plot_lib(
  svg,
  origin,
  scale,
  is_2d=false)

svg = svg.call(d3.drag()
         .on('start', drag_start)
         .on('drag', dragged)
         .on('end', drag_end))
         .append('g');

axis = lib.init_float_axis(axis_len=axis_len, unit=unit);

function plot(scatter, axis, tt){
  let u = scatter[0],
      v = scatter[1];

  let lines = [], points = [];

  lib.plot_lines(axis);

  scatter.forEach(function(d){
    lines.push(...lib.create_segments(d));
  })

  basis = {
      ex: axis[1/unit - 1 + axis_len/unit * 0][1], 
      ey: axis[1/unit - 1 + axis_len/unit * 1][1], 
      ez: axis[1/unit - 1 + axis_len/unit * 2][1],
  };

  let uTv = lib.dot_product(u, v);
  
  let uTvv = {
      x: v.x * uTv,
      y: v.y * uTv,
      z: v.z * uTv,
      r: 1.8,
      color: 'grey'
  }

  let uTvv_line = [
      {x: 0, y: 0, z: 0},
      {x: uTvv.x, y: uTvv.y, z: uTvv.z,
       tt: true}
  ]
  uTvv_line.color = 0
  uTvv_line.centroid_z = 1000;
  uTvv_line.text = 'u\u1d40v = ' + uTv.toFixed(3);
  uTvv_line.text_color = 0;
  uTvv_line.font_size = 14;
  uTvv_line.text_opacity = 1.0;

  lines.push(uTvv_line);

  let dash_line = lib.create_dash_segments(u, uTvv);
  lines.push(...dash_line);

  scatter.forEach(function(d, i){
    let coord = lib.dot_basis(d, basis);
    d.coord = coord;
    let point = Object.assign({}, d);
    if (i == 0) {
      point.text = 'u = ';
    } else {
      point.text = 'v = ';
    }
    point.text += '['.concat(
        coord.x.toFixed(2),
        ', ',
        coord.y.toFixed(2),
        ', ',
        coord.z.toFixed(2),
        ']');
    points.push(point);
  })

  points.push(uTvv);

  lib.plot_lines(lines, tt, 'arrow');
  lib.plot_points(points, tt,
                  drag_point_fn=function(d, i){
                    if ( i == 0) {
                      dragged_point(i);
                    } else {
                      dragged_point_only();
                    }
                  },
                  drag_start_fn=drag_start,
                  drag_end_fn=drag_end);

  let texts_to_show = [
      [
          {text: 'u'}, {text: '= ['},  
          {text: u.coord.x.toFixed(2), color: 8},
          {text: ''}, {text: ''}, {text: ','},
          {text: u.coord.y.toFixed(2), color: 8},
          {text: ''}, {text: ''}, {text: ','},
          {text: u.coord.z.toFixed(2), color: 8},
          {text: ''}, {text: ''}, {text: ']'}
      ], [
          {text: 'v'}, {text: '= ['},
          {text: ''}, {text: ''},
          {text: v.coord.x.toFixed(2), color: 6},
          {text: ','}, {text: ''}, {text: ''},
          {text: v.coord.y.toFixed(2), color: 6},
          {text: ','}, {text: ''}, {text: ''},
          {text: v.coord.z.toFixed(2), color: 6},
          {text: ']'}
      ], [
          {text: 'u\u1d40v', color: 0}, {text: '='},
          {text: u.coord.x.toFixed(2), color: 8},
          {text: '\u00d7'},
          {text: v.coord.x.toFixed(2), color: 6},
          {text: '+'},
          {text: u.coord.y.toFixed(2), color: 8},
          {text: '\u00d7'},
          {text: v.coord.y.toFixed(2), color: 6},
          {text: '+'},
          {text: u.coord.z.toFixed(2), color: 8},
          {text: '\u00d7'},
          {text: v.coord.z.toFixed(2), color: 6},
          {text: ''}
      ], [
          {text: ''}, {text: '='},
          {text: uTv.toFixed(3), color: 0},
          {text: ''}, {text: ''}, {text: ''},
          {text: ''}, {text: ''}, {text: ''},
          {text: ''}, {text: ''}, {text: ''},
          {text: ''}, {text: ''},
      ]
  ];
 
  lib.plot_texts(lib.text_table_to_list(
      texts_to_show, 
      start_coord_x=-2.2, start_coord_y=2.2,
      col_unit=0.24, row_unit=0.3,
      dhs_array=[1.5, 1.2, 2.2, 0.8, 2.2, 0.8, 2.2, 0.8, 2.2, 0.8, 2.2, 0.8, 2.2],
      dws_array=[1.0, 1.8, 1.0])
  );
}

function init(){
  let u = {
      x: 0.8,
      y: 0.8, 
      z: -0.8,
      color: 4,
  };

  let v = {
      x: 1/Math.sqrt(14),
      y: -2/Math.sqrt(14), 
      z: 3/Math.sqrt(14),
      color: 2,
  };
  scatter = [u, v];

  expectedScatter = lib.rotate_points(
      scatter, startAngleX, startAngleY, startAngleZ);
  expectedAxis = lib.rotate_lines(
      axis, startAngleX, startAngleY, startAngleZ);
  plot(expectedScatter, 
       expectedAxis, 
       1000);
  drag_end();
}

function drag_start(){
  lib.drag_start();
}

function dragged(){
  [angle_x, angle_y] = lib.get_drag_angles();

  expectedScatter = lib.rotate_points(scatter, angle_x, angle_y);
  expectedAxis = lib.rotate_lines(axis, angle_x, angle_y);
  
  plot(expectedScatter, 
       expectedAxis, 
       0);
}

function dragged_point_only(){
  [angle_x, angle_y] = lib.get_drag_angles();

  expectedScatter = lib.rotate_points(scatter, angle_x, angle_y);
  
  plot(expectedScatter, 
       expectedAxis, 
       0);
}

function dragged_point(i){
  [angle_x, angle_y] = lib.get_drag_angles();

  expectedScatter = [];
  scatter.forEach(function(d, j){
      if (j == i) {
        expectedScatter.push(lib.rotate_point(d, angle_x, angle_y));
      } else {
        expectedScatter.push(d);
      }
  });
  
  plot(expectedScatter, 
       expectedAxis, 
       0);
}

function drag_end(){
  scatter = expectedScatter;
  axis = expectedAxis;
  startAngleX = 0;
  startAngleY = 0;
  startAngleZ = 0;
}

init();

return {
  init: function(){init();}
};

})();



