
# cmd

- dmr init
  - make .dmr
- dmr *
  - check 本目录上级最近的.dmr
  - 全局有个dmr，没找到用全局
    - 全局的设置用dmr init --base

- dmr run project/task

- dmr run ./sss.json



/config/project/aci.task
/config/project/aci.input.source
/config/project/aci.output.source
/config/project/aci.segment.pipeline
/config/project/aci.filter.pipeline
/config/project/aci.operate.pipeline
/config/project/aci.select.pipeline

{
  input:"aci.input.source",
  output:"aci.output.source",
  process: [
    "/common/gunzip.pipeline"
    "aci.segment.pipeline"
  ]
}
/config/project/task-aci.task