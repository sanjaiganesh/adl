task 'fix-line-endings', 'typescript', ->
  typescriptFiles()
    .pipe eol {eolc: 'LF', encoding:'utf8'}
    .pipe destination 'src'

task 'clean' , 'typescript', (done)->
  typescriptProjectFolders()
    .pipe foreach (each,next)->
      rmdir "#{each.path}/dist/" , ->
        rmdir "#{each.path}/node_modules/" , ->
          erase "#{each.path}/package-lock.json" 
          next null

task 'test', 'typescript',['build/typescript'], (done)->
  typescriptProjectFolders()
    .pipe where (each) ->
      return true if test "-d", "#{each.path}/test"
      return false
    .pipe foreach (each,next)->
      if test "-f", "#{each.path}/node_modules/.bin/mocha"
        execute "#{each.path}/node_modules/.bin/mocha test  --timeout 15000", {cwd: each.path}, (c,o,e) ->
          next null
      else
        next null

task 'build', 'typescript', (done)-> 
  typescriptProjectFolders()
    .on 'end', -> 
      run 'build/typescript', ->
        done()

    .pipe where (each ) -> 
      return test "-f", "#{each.path}/tsconfig.json"
      
    .pipe foreach (each,next ) ->
      fn = filename each.path
      deps =  ("build/typescript/#{d}" for d in (global.Dependencies[fn] || []) )
      
      task 'build/typescript', fn,deps, (fin) ->
        execute "tsc --project #{each.path} ", {cwd: each.path }, (code,stdout,stderr) ->
          if watch 
            execute "#{basefolder}/node_modules/.bin/tsc --watch --project #{each.path}", (c,o,e)-> 
             echo "watching #{fn}"
            , (d) -> echo d.replace(/^src\//mig, "#{basefolder}/src/")
          fin()
      next null
    return null

task 'npm-install', '', (done)-> 
  for each of Dependencies 
    mkdir "-p", "#{basefolder}/src/#{each}/node_modules/@microsoft.azure" if !test "-d", "#{basefolder}/src/#{each}/node_modules/@microsoft.azure"
    for item in Dependencies[each]
      mklink "#{basefolder}/src/#{each}/node_modules/@microsoft.azure/#{item}" , "#{basefolder}/src/#{item}"

  global.threshold =1
  typescriptProjectFolders()
    .on 'end', -> 
      run 'npm-install', ->
        done()

    .pipe where (each ) -> 
      return test "-f", "#{each.path}/tsconfig.json"
      
    .pipe foreach (each,next ) ->
      fn = filename each.path
      deps =  ("npm-install/#{d}" for d in (global.Dependencies[fn] || []) )
      
      task 'npm-install', fn,deps, (fin) ->
        execute "npm install", {cwd: each.path, silent:false }, (code,stdout,stderr) ->
          fin()

      next null
    return null

