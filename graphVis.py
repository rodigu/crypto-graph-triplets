import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt
import csv

def make_label_dict(labels):
    l = {}
    for i, label in enumerate(labels):
        l[i] = label
    return l

file_name = 'adjacencyMatrix.csv'
input_data = pd.read_csv(file_name, index_col=0)
G = nx.Graph(input_data)

with open(file_name, 'r') as f:
    d_reader = csv.DictReader(f)
    headers = d_reader.fieldnames

labels=make_label_dict(headers)
edge_labels = dict( ((u, v), d["weight"]) for u, v, d in G.edges(data=True) )

pos = nx.spring_layout(G)

nx.draw_networkx_nodes(G, pos, node_size = 8, alpha = .8)
nx.draw_networkx_edges(G, pos, alpha = .8, width = .5)
plt.show()