const filePaths = [
    ".gitignore",
    "COPYING",
    "INSTALL",
    "Makefile.in",
    "README",
    "README-SDL",
    "THANKS",
    "aclocal.m4",
    "configure",
    "configure.ac",
    "gource.win32.cbp",
    "m4/acx_pthread.m4",
    "m4/ax_check_gl.m4",
    "m4/ax_check_glu.m4",
    "m4/ax_check_glut.m4",
    "m4/ax_lang_compiler_ms.m4",
    "m4/freetype2.m4",
    "src/.gitignore",
    "src/Makefile.in",
    "src/action.cpp",
    "src/action.h",
    "src/commitlog.cpp",
    "src/commitlog.h",
    "src/core/.gitignore",
    "src/core/Makefile.in",
    "src/core/bounds.h",
    "src/core/camera.cpp",
    "src/core/camera.h",
    "src/core/display.cpp",
    "src/core/display.h",
    "src/core/extensions.cpp",
    "src/core/extensions.h",
    "src/core/frustum.cpp",
    "src/core/frustum.h",
    "src/core/fxfont.cpp",
    "src/core/fxfont.h",
    "src/core/logger.cpp",
    "src/core/logger.h",
    "src/core/pi.h",
    "src/core/plane.cpp",
    "src/core/plane.h",
    "src/core/quadtree.cpp",
    "src/core/quadtree.h",
    "src/core/regex.cpp",
    "src/core/regex.h",
    "src/core/resource.cpp",
    "src/core/resource.h",
    "src/core/sdlapp.cpp",
    "src/core/sdlapp.h",
    "src/core/seeklog.cpp",
    "src/core/seeklog.h",
    "src/core/stringhash.cpp",
    "src/core/stringhash.h",
    "src/core/texture.cpp",
    "src/core/texture.h",
    "src/core/vectors.h",
    "src/custom.cpp",
    "src/custom.h",
    "src/cvs-exp.cpp",
    "src/cvs-exp.h",
    "src/dirnode.cpp",
    "src/dirnode.h",
    "src/file.cpp",
    "src/file.h",
    "src/git.cpp",
    "src/git.h",
    "src/gource.cpp",
    "src/gource.h",
    "src/main.cpp",
    "src/main.h",
    "src/pawn.cpp",
    "src/pawn.h",
    "src/slider.cpp",
    "src/slider.h",
    "src/spline.cpp",
    "src/spline.h",
    "src/user.cpp",
    "src/user.h",
    "src/zoomcamera.cpp",
    "src/zoomcamera.h"
];

export const dummyData: Tree = {
    name: "root",
    children: [
        {name: "child #1"},
        {
            name: "child #2",
            children: [
                {name: "grandchild #1"},
                {name: "grandchild #2"},
                {name: "grandchild #3"}
            ]
        }
    ]
};


export const demoData = () => parseFiles(filePaths)

export const parseFiles = (paths: string[]): Tree => {
    const root: Tree = {name: "root", children: []};

    root.children = paths.reduce((r: Tree[], path: string) => {
        path.split('/')
            .reduce((acc: Tree[] | undefined, currentName) => {
                let temp = acc?.find(t => t.name === currentName);
                if (!temp) {
                    acc?.push(temp = {name: currentName, children: []});
                }
                return temp?.children;
            }, r);
        return r;
    }, [])

    return root
}

export interface Tree {
    name: string
    children?: Tree[]
}